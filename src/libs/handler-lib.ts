import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

type LambdaHandler = {
  (
    event: APIGatewayProxyEvent,
    context: APIGatewayEventRequestContext
  ): Promise<unknown>;
};

export function handler(lambda: LambdaHandler) {
  return async function (
    event: APIGatewayProxyEvent,
    context: APIGatewayEventRequestContext
  ): Promise<APIGatewayProxyResult> {
    let body: unknown, statusCode: number;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
}
