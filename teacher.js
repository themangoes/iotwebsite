import { DynamoDBClient } from "./node_modules/@aws-sdk/client-dynamodb/dist-es/DynamoDBClient.js";
import { DynamoDBDocumentClient } from "./node_modules/@aws-sdk/lib-dynamodb/dist-es/DynamoDBDocumentClient.js";
import { GetCommand } from "./node_modules/@aws-sdk/lib-dynamodb/dist-es/commands/GetCommand.js";
import { PutCommand } from "./node_modules/@aws-sdk/lib-dynamodb/dist-es/commands/PutCommand.js";
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
    var teacherId = currURL.searchParams.get("id");
    let selectedClassNum = 1;
    var selectClass = document.getElementById("class-select");
    let teacherData = await docClient.send(await new GetCommand({
        TableName:"teachers",
        Key:{id:teacherId}
    }))
    document.getElementById("greeting").innerHTML = "Hello, " + teacherData["Item"]["name"] + "!";
    var teacherTable = document.getElementById("attendanceDetailsTable");
    var studentIds = await docClient.send(await new ScanCommand({
        TableName:"students",
        AttributesToGet: ["id"]
    }));
    var totalClassesHeld = teacherData["Item"]["classes_held"];
    for(let i = 1; i <= totalClassesHeld; i++)
    {
        let classData = await docClient.send(await new GetCommand({
            TableName:"classes",
            Key:{
                teacher_id:teacherId,
                class_number:i
            }
        }));
        let classDetailsTable = document.getElementById("classDetailsTable");
        let row = classDetailsTable.insertRow();
        let classNumberCell = row.insertCell(0);
        let dateCell = row.insertCell(1);
        let startTimeCell = row.insertCell(2);
        let endTimeCell = row.insertCell(3);
        let attendeesCell = row.insertCell(4)
        
        classNumberCell.innerHTML = "Class " + classData["Item"]["class_number"];
        dateCell.innerHTML = classData["Item"]["date"];
        startTimeCell.innerHTML = classData["Item"]["class_start_time"];
        endTimeCell.innerHTML = classData["Item"]["class_end_time"];
        let attendeesCount;
        if (classData["Item"]["attending_students"].size == 1 && classData["Item"]["attending_students"].has("None"))
            attendeesCount = 0;
        else
            attendeesCount = classData["Item"]["attending_students"].size;
        attendeesCell.innerHTML = attendeesCount + "/" + studentIds['Items'].length;

        let option = document.createElement("option");
        option.text = "Class " + i;
        option.value = i;
        selectClass.add(option);
    }
    selectClass.addEventListener("change", async function(){
        selectedClassNum = selectClass.value;
        for (let i = 0; i < studentIds['Items'].length; i++)
        {
            teacherTable.deleteRow(1);
        }
        populateAttendanceTable();
    })

    
    async function populateAttendanceTable(){
        let classData;
        let attendingStudentsCount = 0;
        for (let i = 0; i < studentIds['Items'].length; i++)
        {
            classData = await docClient.send(await new GetCommand({
                TableName:"classes",
                Key:{
                    teacher_id:teacherId,
                    class_number:Number(selectedClassNum)
                }
            }));
            var studentData = await docClient.send(await new GetCommand({
                TableName:"students",
                Key:{id:studentIds["Items"][i]["id"]["S"]},
            }));

            let row = teacherTable.insertRow();
            let nameCell = row.insertCell(0);
            let buttonCell = row.insertCell(1)

            nameCell.innerHTML = studentData["Item"]["name"];
            if (classData["Item"]["attending_students"].has(studentIds["Items"][i]["id"]["S"]))
            {
                buttonCell.innerHTML = "Present";
                attendingStudentsCount += 1;
            }
            else
            {
                buttonCell.innerHTML = "<button id=student" + i + ">Mark Present</button>";
                let currStudentButton = document.getElementById("student"+i);
                currStudentButton.addEventListener("click", async () => {
                    classData = await docClient.send(await new GetCommand({
                        TableName:"classes",
                        Key:{
                            teacher_id:teacherId,
                            class_number:Number(selectedClassNum)
                        }
                    }));
                    let attendingStudentsSet = classData["Item"]["attending_students"];
                    attendingStudentsSet.add(studentIds["Items"][i]["id"]["S"]);
                    console.log(attendingStudentsSet);
                    await docClient.send(await new PutCommand({
                        TableName:"classes",
                        Item:{
                            teacher_id:classData["Item"]["teacher_id"],
                            class_number:classData["Item"]["class_number"],
                            attending_students:attendingStudentsSet,
                            class_start_time:classData["Item"]["class_start_time"],
                            class_end_time:classData["Item"]["class_end_time"],
                            date:classData["Item"]["date"]
                        }   
                    }));
                    buttonCell.innerHTML = "Present";
                    attendingStudentsCount += 1;
                })
            }
        }
        document.getElementById("classDetails").innerHTML = "Date: " + classData["Item"]["date"] + 
                                                            ". Start Time: " + classData["Item"]["class_start_time"] +
                                                            ". End Time: " + classData["Item"]["class_end_time"];
        document.getElementById("attendanceDetails").innerHTML = attendingStudentsCount + "/" + studentIds['Items'].length +
                                                                " Attendance";
    }
    populateAttendanceTable();
}

main();