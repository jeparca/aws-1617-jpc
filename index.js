var express = require("express");
var bodyParser = require("body-parser");
var port = (process.env.PORT || 3000);

var app = express();

var baseAPI = "/api/v1";

var contacts = [{
    name: "Pepe",
    phone: "12345",
    email: "pepe@pepe.com"
},{
    name: "Luis",
    phone: "67890",
    email: "luis@luis.com"
}];

app.use(bodyParser.json());

app.get(baseAPI+"/contacts", (request, response) => {
    response.send(contacts);
    console.log("GET /contacts");
});

app.post(baseAPI+"/contacts", (request, response) => {
    var contact = request.body;
    contacts.push(contact);
    response.sendStatus(201);
    console.log("POST /contacts");
});

app.put(baseAPI+"/contacts", (request, response) => {
    response.sendStatus(405);
    console.log("PUT /contacts");
});

app.delete(baseAPI+"/contacts", (request, response) => {
    contacts = [];
    response.sendStatus(200);
    console.log("DELETE /contacts");
});

app.listen(port, () => {
    console.log("Server up and running");
}); 
