import * as uuid from 'uuid';
import handler, { created, getUserId, ok } from '../util/handler';
import dynamoDb from '../util/dynamodb';
import AWS from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const main = handler(async (event) => {
  const data = JSON.parse(event.body ?? '');

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      userId: getUserId(event),
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createAt: Date.now(),
    },
  };

  return created(await dynamoDb.put(params));
});
