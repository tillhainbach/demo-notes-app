import { ChangeEventHandler, FormEventHandler, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { Api } from '../lib/api';
import { s3Download, s3Upload } from '../lib/awsLib';
import { onError } from '../lib/errorLib';
import './Note.css';

function formatFilename(filename: string) {
  return filename.replace(/^\w+-/, '');
}

export default function Note() {
  const file = useRef<File | undefined>(undefined);
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [note, setNote] = useState<Api.Note | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function onLoad() {
      if (id === undefined) return;
      try {
        const note = await Api.loadNote(id);
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentUrl = await s3Download(attachment);
        }

        setNote(note);
        setContent(content);
      } catch (error) {
        onError(error);
      }
    }

    onLoad();
  }, [id]);

  const validateForm = () => (note?.content ?? 0) > 0;
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    file.current = event.target.files?.[0];
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1_000_000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : undefined;

      await Api.createNote({ content, attachment });
      navigate('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  const handleDelete: FormEventHandler = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this note?');

    if (!confirmed) return;

    setIsDeleting(true);
  };

  return (
    <div className="Note">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Save
        </LoaderButton>
        <LoaderButton
          type="submit"
          size="lg"
          variant="primary"
          onClick={handleDelete}
          isLoading={isLoading}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
