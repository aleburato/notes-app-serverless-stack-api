import { APIGatewayProxyEvent } from "aws-lambda";

export function getUserId(event: APIGatewayProxyEvent) {
  return event.requestContext.identity.cognitoIdentityId;
}
