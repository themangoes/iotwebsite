import { DynamoDBClient } from "/node_modules/@aws-sdk/client-dynamodb/dist-es/DynamoDBClient.js";
import { DynamoDBDocumentClient } from "/node_modules/@aws-sdk/lib-dynamodb/dist-es/DynamoDBDocumentClient.js";
import { GetCommand } from "/node_modules/@aws-sdk/lib-dynamodb/dist-es/commands/GetCommand.js";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

table = document.getElementById("studentTable");

let classNum;
let studentData= docClient.send(new GetCommand({TableName:"students",
							  Key:{id:"A001"},
							 }));
let totalClasses = studentData["Item"]["classes_attended"];

for (classNum = 1; classNum <= totalClasses; classNum++)
{
	command = new GetCommand({
				 TableName:"attendance",
				 Key:{
					student_id:"A001",
					student_class_number: classNum
				     }
				 });

	response = docClient.send(command);
	console.log(response["Item"]);

	let newRow = table.insertRow(classNum - 1);
	let studentNameCell = newRow.insertCell(0);
	let teacherNameCell = newRow.insertCell(1);
	let dateCell = newRow.insertCell(2);
	let classStartTimeCell = newRow.insertCell(3);
	let attendingTimeCell = newRow.insertCell(4);

	studentNameCell.innerHTML = response["Item"]["student_id"];
	teacherNameCell.innerHTML = response["Item"]["teacher_id"];
	dateCell.innerHTML = response["Item"]["date"];
	classStartTimeCell.innerHTML = response["Item"]["class_start_time"];
	attendingTimeCell.innerHTML = response["Item"]["attending_time"];
}