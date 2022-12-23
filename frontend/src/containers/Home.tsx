import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import { Api } from '../lib/api';
import { useAppContext } from '../lib/contextLib';
import { onError } from '../lib/errorLib';
import './Home.css';

function NotesList({ notes }: { notes: Api.Note[] }) {
  return (
    <ListGroup>
      <LinkContainer to="/notes/new">
        <ListGroup.Item action className="py-3 text-nowrap text-truncate">
          <BsPencilSquare size={17} />
          <span className="ml-2 font-weight-bold">Create a new Note</span>
        </ListGroup.Item>
      </LinkContainer>
      {notes.map(({ noteId, content, createAt }) => (
        <LinkContainer key={noteId} to={`/notes/${noteId}`}>
          <ListGroup.Item action>
            <span className="font-weight-bold">
              {content.trim().split('\n')[0]}
            </span>
            <br />
            <span className="text-muted">
              Created: {new Date(createAt).toLocaleString()}
            </span>
          </ListGroup.Item>
        </LinkContainer>
      ))}
    </ListGroup>
  );
}

function Notes({
  isLoading,
  notes,
}: {
  isLoading: boolean;
  notes: Api.Note[];
}) {
  return (
    <div className="Notes">
      <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
      {!isLoading && <NotesList notes={notes} />}
    </div>
  );
}

function Lander() {
  return (
    <div className="lander">
      <h1>Scratch</h1>
      <p className="text-muted">A simple note taking app</p>
    </div>
  );
}

export default function Home() {
  const [notes, setNotes] = useState<Api.Note[]>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) return;

      try {
        const notes = await Api.loadNotes();
        setNotes(notes);
      } catch (error) {
        onError(error);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  return (
    <div className="Home">
      {isAuthenticated ? (
        <Notes notes={notes} isLoading={isLoading} />
      ) : (
        <Lander />
      )}
    </div>
  );
}
