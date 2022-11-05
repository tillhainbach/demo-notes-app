import { Bucket, Table } from '@serverless-stack/resources';
import type { Stack, App } from '@serverless-stack/resources';
import type { StackFnProps } from './types';

export function StorageStack({ stack, app }: StackFnProps) {
  const bucket = new Bucket(stack, 'Uploads');

  const table = new Table(stack, 'Notes', {
    fields: {
      userId: 'string',
      noteId: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' },
  });

  return { table, bucket };
}
