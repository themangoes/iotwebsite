
import { fileURLToPath } from "node:url";

// snippet-start:[javascript.v3.dynamodb.hello]
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
  let classNum;
  let studentData= await docClient.send(new GetCommand({TableName:"students",
							  Key:{id:"A001"},
							 }));
  let totalClasses = studentData["Item"]["classes_attended"];

  for (classNum = 1; classNum <= totalClasses; classNum++)
  {
  	  const command = new GetCommand({TableName:"attendance",
			Key:{student_id:"A001",
			student_class_number: classNum}});

	  const response = await docClient.send(command);
	  console.log(response["Item"]);
  }
  
};
// snippet-end:[javascript.v3.dynamodb.hello]

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}