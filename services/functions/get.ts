import handler, { getUserId, ok } from '../util/handler';
import dynamodb from '../util/dynamodb';

export const main = handler(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: getUserId(event),
      noteId: event.pathParameters?.id,
    },
  };
  const result = await dynamodb.get(params);

  if (result.Item === undefined) {
    throw new Error('Item not found.');
  }

  return ok(result.Item);
});
