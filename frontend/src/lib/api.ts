import { API } from 'aws-amplify';

export * as Api from './api';

export type NoteCreate = {
  content: string;
  attachment?: string;
};

export type Note = NoteCreate & {
  noteId: string;
  createAt: number;
  attachmentUrl?: string;
};

export async function loadNotes(): Promise<Note[]> {
  return await API.get('notes', '/notes', {});
}

export async function loadNote(noteId: string): Promise<Note> {
  return await API.get('notes', `/notes/${noteId}`, {});
}

export async function createNote(note: NoteCreate) {
  return await API.post('notes', '/notes', {
    body: note,
  });
}
