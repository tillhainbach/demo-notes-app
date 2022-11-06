import handler, { getUserId, ok } from '../util/handler';
import dynamoDb from '../util/dynamodb';

export const main = handler(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME!,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': getUserId(event),
    },
  };

  const result = await dynamoDb.query(params);

  return ok(result.Items ?? []);
});
