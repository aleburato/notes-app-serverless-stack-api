import { handler } from "libs/handler-lib";
import { dynamoDb, getTableName } from "libs/dynamodb-lib";
import { getUserId } from "libs/event-lib";

export const main = handler(async (event) => {
  const noteId = event.pathParameters?.id;
  if (!noteId) {
    throw new Error("Missing 'id' path parameter");
  }
  const params = {
    TableName: getTableName(),
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: getUserId(event),
      noteId,
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
});
