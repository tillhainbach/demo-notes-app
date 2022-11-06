import handler, { getUserId, notContent } from '../util/handler';
import dynamoDb from '../util/dynamodb';

export const main = handler(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: getUserId(event),
      noteId: event.pathParameters?.id,
    },
  };

  await dynamoDb.delete(params);

  return notContent();
});
