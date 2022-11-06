import handler, { getUserId, ok } from '../util/handler';
import dynamoDb from '../util/dynamodb';

export const main = handler(async (event) => {
  const data = JSON.parse(event.body ?? '');

  const params = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: getUserId(event),
      noteId: event.pathParameters?.id,
    },
    UpdateExpression: 'SET content = :content, attachment = :attachment',
    ExpressionAttributeValues: {
      ':attachment': data?.attachment || null,
      ':content': data?.content || null,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDb.update(params);

  return ok(result.Attributes);
});
