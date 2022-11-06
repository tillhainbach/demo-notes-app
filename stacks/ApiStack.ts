import { Api, use } from '@serverless-stack/resources';
import { StorageStack } from './StorageStack';
import type { StackFnProps } from './types';

export function ApiStack({ stack, app }: StackFnProps) {
  const { table } = use(StorageStack);

  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    },
    routes: {
      'GET /notes': 'functions/list.main',
      'POST /notes': 'functions/create.main',
      'GET /notes/{id}': 'functions/get.main',
      'PUT /notes/{id}': 'function/update.main',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
