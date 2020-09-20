import * as uuid from "uuid";
import { handler } from "./libs/handler-lib";
import { dynamoDb, getTableName } from "./libs/dynamodb-lib";

type NoteBody = {
  content: string;
  attachment: string;
};

export const main = handler(async (event) => {
  if (!event.body) {
    throw new Error("Event must have a body");
  }
  const data = JSON.parse(event.body) as NoteBody;
  const params = {
    TableName: getTableName(),
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
