import { SNSHandler } from "aws-lambda";

// Lambda Y is subscribed to SNS Topic 1 directly
export const handler: SNSHandler = async (event, context) => {
  try {
    console.log("Lambda Y received SNS event: ", JSON.stringify(event));
    
    // Process SNS messages
    for (const record of event.Records) {
      console.log("SNS message ID:", record.Sns.MessageId);
      console.log("SNS message:", record.Sns.Message);
      
      // Process the SNS message here...
    }
    
  } catch (error: any) {
    console.error("Error processing SNS message:", error);
    throw new Error(JSON.stringify(error));
  }
};
