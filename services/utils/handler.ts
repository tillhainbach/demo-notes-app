import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda';

type LambdaArgs = Parameters<APIGatewayProxyHandlerV2>;
type LambdaFn<Result> = (
  event: LambdaArgs[0],
  context: LambdaArgs[1]
) => Promise<Result>;

export function created(data: any): APIGatewayProxyResultV2 {
  return {
    statusCode: 201,
    body: JSON.stringify(data),
  };
}

export function ok(data: any): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

function internalError(error: Error): APIGatewayProxyResultV2 {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error.message }),
  };
}

export default function (
  lambda: LambdaFn<APIGatewayProxyResultV2>
): APIGatewayProxyHandlerV2<APIGatewayProxyResultV2> {
  return async function (event, context) {
    try {
      return await lambda(event, context);
    } catch (error) {
      console.error(error);
      return internalError(error as Error);
    }
  };
}
