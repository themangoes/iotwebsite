import { DynamoDBClient } from "./node_modules/@aws-sdk/client-dynamodb/dist-es/DynamoDBClient.js";
import { DynamoDBDocumentClient } from "./node_modules/@aws-sdk/lib-dynamodb/dist-es/DynamoDBDocumentClient.js";
import { GetCommand } from "./node_modules/@aws-sdk/lib-dynamodb/dist-es/commands/GetCommand.js";

const cred = {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY
};
console.log(cred)

const client = new DynamoDBClient({
	region : "ap-south-1",
	credentials : cred
});
const docClient = DynamoDBDocumentClient.from(client);

var isTeacher = false;
document.addEventListener("DOMContentLoaded", () => {
    let studentButton = document.getElementById("studentButton");
    let teacherButton = document.getElementById("teacherButton");
    let loginHeader = document.getElementById("loginHeader");
    let idInputField = document.getElementById("username");

    studentButton.addEventListener("click", () => {
        teacherButton.classList.remove("pressed");
        teacherButton.classList.add("unpressed");
        studentButton.classList.remove("unpressed");
        studentButton.classList.add("pressed");
        idInputField.placeholder = "Enter Student ID";
        loginHeader.innerHTML = "Login as Student"
        isTeacher = false;
    })
    document.getElementById("teacherButton").addEventListener("click", () => {
        studentButton.classList.remove("pressed");
        studentButton.classList.add("unpressed");
        teacherButton.classList.remove("unpressed");
        teacherButton.classList.add("pressed");
        idInputField.placeholder = "Enter Teacher ID";
        loginHeader.innerHTML = "Login as Teacher"
        isTeacher = true;
    })
    document.getElementById("seePassword").addEventListener("change", () => {
        let viewPasskeyCheckBox = document.getElementById("seePassword");
        let passwordInputField = document.getElementById("passwordField");
        if (viewPasskeyCheckBox.checked)
        {
            passwordInputField.type = "text";
        }
        else
        {
            passwordInputField.type = "password";
        }
    })
})

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    let invalidIdLabel = document.getElementById("invalidId");
    const inputtedId = document.getElementById("username").value;
    const inputtedPasskey = document.getElementById("passwordField").value;
    let type = (isTeacher) ? "teacher" : "student";
    
    let loginData = await docClient.send(await new GetCommand({
        TableName:"loginData",
        Key:{
            id:inputtedId,
            passkey:inputtedPasskey
        }
    }))
    if (loginData["Item"] == null)
    {
        invalidIdLabel.innerHTML = "Invalid ID or Password or User type!"
        return;
    }
    else if (loginData["Item"]["type"] != type)
    {
        invalidIdLabel.innerHTML = "Invalid ID or Password or User type!"
        return;
    }

    if (isTeacher) {
        window.location.href = 'teacher.html?id=' + inputtedId;
    } else {
        window.location.href = 'student.html?id=' + inputtedId;
    }
});
