import { SNSHandler } from "aws-lambda";

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
        
      }
    }
    
  } catch (error: any) {
    console.error("Error processing SNS message:", error);
    throw new Error(JSON.stringify(error));
  }
};
