import { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", JSON.stringify(event));

    // Processing GET /crew/movies/{movieId}?role=roleName request
    if (event.requestContext.http.method === "GET" && event.pathParameters?.movieId) {

      const movieId = event.pathParameters.movieId;
      const role = event.queryStringParameters?.role;
      
      if (!movieId || !role) {
        return {
          statusCode: 400,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ 
            message: "The movieId and role parameters must be provided" 
          }),
        };
      }
      
      // Query DynamoDB
      const command = new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          movieId: parseInt(movieId),
          role: role
        }
      });
      
      const response = await client.send(command);
      
      if (!response.Item) {
        return {
          statusCode: 404,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ 
            message: `No role ${role} found for movie ID ${movieId}` 
          }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(response.Item),
      };
    }

    // Handle other requests
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
