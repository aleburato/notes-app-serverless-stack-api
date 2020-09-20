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
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: getUserId(event),
      noteId,
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});
