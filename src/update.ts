import { handler } from "./libs/handler-lib";
import { dynamoDb, getTableName } from "./libs/dynamodb-lib";

export const main = handler(async (event) => {
  const noteId = event.pathParameters?.id;
  if (!noteId) {
    throw new Error("Missing 'id' path parameter");
  }
  if (!event.body) {
    throw new Error("Event must have a body");
  }
  const data = JSON.parse(event.body);

  const params = {
    TableName: getTableName(),
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params);

  return { status: true };
});
