import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '../lib/api';
import { s3Download } from '../lib/awsLib';
import { onError } from '../lib/errorLib';

export default function Note() {
  const file = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Api.Note | undefined>(undefined);

  useEffect(() => {
    async function onLoad() {
      if (id === undefined) return;
      try {
        const note = await Api.loadNote(id);
        if (note.attachment) {
          note.attachmentUrl = await s3Download(note.attachment);
        }

        setNote(note);
      } catch (error) {
        onError(error);
      }
    }

    onLoad();
  }, [id]);

  return <div className="Notes"></div>;
}
