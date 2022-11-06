import { Bucket, Table } from '@serverless-stack/resources';
import type { StackFnProps } from './types';
import * as cdk from 'aws-cdk-lib';

export function StorageStack({ stack, app }: StackFnProps) {
  const bucket = new Bucket(stack, 'Uploads');

  const table = new Table(stack, 'Notes', {
    fields: {
      userId: 'string',
      noteId: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' },
    cdk: {
      table: {
        // don't keep this table after clean up
        // since it's just a demo app
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    },
  });

  return { table, bucket };
}
