import { ChangeEventHandler, FormEventHandler, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { Api } from '../lib/api';
import { s3Upload } from '../lib/awsLib';
import { onError } from '../lib/errorLib';
import './NewNote.css';

export default function NewNote() {
  const file = useRef<File | undefined>(undefined);

  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

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
      nav('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="NewNote">
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
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
