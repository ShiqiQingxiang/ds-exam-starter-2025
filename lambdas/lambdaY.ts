import { SNSHandler } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.REGION });

// Lambda Y is subscribed to SNS Topic 1 directly (Only receives messages with country NOT Ireland or China)
export const handler: SNSHandler = async (event, context) => {
  try {
    console.log("Lambda Y received SNS event: ", JSON.stringify(event));
    
    // Process SNS messages
    for (const record of event.Records) {
      console.log("SNS message ID:", record.Sns.MessageId);
      console.log("SNS message:", record.Sns.Message);
      
      const messageContent = JSON.parse(record.Sns.Message);
      
      // Verify this is a message with country not Ireland or China
      if (messageContent.address && 
          messageContent.address.country !== "Ireland" && 
          messageContent.address.country !== "China") {
        
        console.log(`Processing message for ${messageContent.name} from ${messageContent.address.country}`);
        
        // Part C: Check if email property is missing
        if (!messageContent.email) {
          console.log(`Message missing email property, sending to Queue B`);
          
          // Send the message to Queue B
          try {
            const queueBUrl = process.env.QUEUE_B_URL;
            
            if (!queueBUrl) {
              throw new Error("Queue B URL not configured in environment variables");
            }
            
            await sqsClient.send(new SendMessageCommand({
              QueueUrl: queueBUrl,
              MessageBody: JSON.stringify(messageContent),
              MessageAttributes: {
                Source: {
                  DataType: "String",
                  StringValue: "LambdaY"
                }
              }
            }));
            
            console.log(`Successfully sent message to Queue B`);
          } catch (sqsError) {
            console.error("Error sending message to Queue B:", sqsError);
            throw sqsError;
          }
        } else {
          console.log(`Message has email property: ${messageContent.email}, not sending to Queue B`);
        }
      }
    }
    
  } catch (error: any) {
    console.error("Error processing SNS message:", error);
    throw new Error(JSON.stringify(error));
  }
};
