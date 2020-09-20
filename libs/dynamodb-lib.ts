import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

const dynamoDb = {
  get: (params: AWS.DynamoDB.DocumentClient.GetItemInput) =>
    client.get(params).promise(),
  put: (params: AWS.DynamoDB.DocumentClient.PutItemInput) =>
    client.put(params).promise(),
  query: (params: AWS.DynamoDB.DocumentClient.QueryInput) =>
    client.query(params).promise(),
  update: (params: AWS.DynamoDB.DocumentClient.UpdateItemInput) =>
    client.update(params).promise(),
  delete: (params: AWS.DynamoDB.DocumentClient.DeleteItemInput) =>
    client.delete(params).promise(),
};

const getTableName = (): string => {
  if (!process.env.tableName) {
    throw new Error("Unable to retrieve table name from Env");
  }
  return process.env.tableName;
};

export { dynamoDb, getTableName };
