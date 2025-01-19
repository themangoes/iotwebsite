import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import 'http';
import 'fs';

const client = new DynamoDBClient({});

const input = {
  "Key": {"id":"A001"},
  "TableName": "students"
};

const command = new GetItemCommand(input);
const response = await client.send(command);

http.createServer(function (req, res) {
  /*fs.readFile('IOT-RFID/test.html', function(err, data) {*/
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(response);
    return res.end();
  /*});*/
}).listen(8080);