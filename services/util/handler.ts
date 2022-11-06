import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

type LambdaArgs = Parameters<APIGatewayProxyHandlerV2>;
export type LambdaFn = (
  event: LambdaArgs[0],
  context: LambdaArgs[1]
) => Promise<APIGatewayProxyStructuredResultV2>;

export function created(data: any): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 201,
    body: JSON.stringify(data),
  };
}

export function notContent(): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 204,
  };
}

export function ok(data: any): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

function internalError(error: Error): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error.message }),
  };
}

export function getUserId(event: LambdaArgs[0]): string {
  return (event.requestContext as any).authorizer.iam.cognitoIdentity
    .identityId;
}

function withCorsHeaders(handler: LambdaFn): LambdaFn {
  return async (event, context) => {
    const response = await handler(event, context);
    return {
      ...response,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...response.headers,
      },
    };
  };
}

export default function (
  lambda: LambdaFn
): APIGatewayProxyHandlerV2<APIGatewayProxyStructuredResultV2> {
  return withCorsHeaders(async function (event, context) {
    try {
      return await lambda(event, context);
    } catch (error) {
      console.error(error);
      return internalError(error as Error);
    }
  });
}
