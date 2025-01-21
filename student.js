import { DynamoDBClient } from "./node_modules/@aws-sdk/client-dynamodb/dist-es/DynamoDBClient.js";
import { DynamoDBDocumentClient } from "./node_modules/@aws-sdk/lib-dynamodb/dist-es/DynamoDBDocumentClient.js";
import { GetCommand } from "./node_modules/@aws-sdk/lib-dynamodb/dist-es/commands/GetCommand.js";
import { ScanCommand } from "./node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ScanCommand.js";

import 'url';

var currURL = new URL(window.location.href);

const cred = {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY
};

const client = new DynamoDBClient({
	region : "ap-south-1",
	credentials : cred
});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
	var table = document.getElementById("studentTable");
	var percentageTable = document.getElementById("attendancePercentage");


	var teacherIds = await docClient.send(await new ScanCommand({
																	TableName:"teachers",
																	AttributesToGet: ["id"]
																}));

	let studentId = currURL.searchParams.get("id");
	var studentData = await docClient.send(await new GetCommand({
																	TableName:"students",
																	Key:{id:studentId},
																}));
	document.getElementById("greeting").innerHTML = "Hello, " + studentData["Item"]["name"] + "!";

	for (let i = 0; i < teacherIds["Items"].length; i++)
	{
		let classNum;

		let teacherData = await docClient.send(await new GetCommand({
														TableName:"teachers",
														Key:{id:teacherIds["Items"][i]["id"]["S"]}
														}));
    	let attendedClasses = 0;
		let totalClasses = teacherData["Item"]["classes_held"];
		let attendancePercentage;
	
		let row = percentageTable.insertRow();
		let teacherName = row.insertCell(0);
		let percent = row.insertCell(1);

    	row.style.textAlign = "center"
		teacherName.style.textAlign = "center";
		percent.style.textAlign = "center";
		teacherName.innerHTML = teacherData["Item"]["name"];
		

		for (classNum = 1; classNum <= totalClasses; classNum++)
		{
			var command = await new GetCommand({
						 							TableName:"classes",
						 							Key:{
															teacher_id:teacherIds["Items"][i]["id"]["S"],
															class_number: classNum
					    		 						}
					 							});

			var response = await docClient.send(command);
		
			let attendingStudents = response["Item"]["attending_students"];
			let attendingStatus = (attendingStudents.has(studentId)) ? "Present" : "Absent";

			let newRow = table.insertRow();
			let teacherNameCell = newRow.insertCell(0);
			let dateCell = newRow.insertCell(1);
			let classStartTimeCell = newRow.insertCell(2);
			let classEndTimeCell = newRow.insertCell(3);
			let status = newRow.insertCell(4);

			teacherNameCell.innerHTML = teacherData["Item"]["name"];
			dateCell.innerHTML = response["Item"]["date"];
			classStartTimeCell.innerHTML = response["Item"]["class_start_time"];
			classEndTimeCell.innerHTML = response["Item"]["class_end_time"];
			status.innerHTML = attendingStatus;
			if (attendingStatus == "Absent")
				status.style.color = "red";
			else
			{
				attendedClasses += 1;
				status.style.color = "green";							
			}
		}	
		
		attendancePercentage = (attendedClasses / totalClasses) * 100;
		percent.innerHTML = attendancePercentage.toFixed(2) + "%";
	}
}

main();