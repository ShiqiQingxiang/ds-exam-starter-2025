import { SQSHandler } from "aws-lambda";

// Lambda X processes messages from Queue A
export const handler: SQSHandler = async (event, context) => {
  try {
    console.log("Lambda X received event: ", JSON.stringify(event));
    
    // Process SQS messages
    for (const record of event.Records) {
      console.log("Processing SQS message:", record.messageId);
      
      const body = JSON.parse(record.body);
      
      // If this is from SNS, it will have a Message property
      if (body.Message) {
        console.log("SNS message content:", body.Message);
        
        // Process the message here...
      }
    }
    
    return; 
  } catch (error: any) {
    console.error("Error processing messages:", error);
    throw new Error(JSON.stringify(error));
  }
};
