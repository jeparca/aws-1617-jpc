var express = require("express");
var bodyParser = require("body-parser");
var port = (process.env.PORT || 3000);

var app = express();

var baseAPI = "/api/v1";

var contacts = [{
    name: "Pepe",
    phone: "12345",
    email: "pepe@pepe.com"
}, {
    name: "Luis",
    phone: "67890",
    email: "luis@luis.com"
}];

app.use(bodyParser.json());

app.get(baseAPI + "/contacts", (request, response) => {
    response.send(contacts);
    console.log("GET /contacts");
});

app.get(baseAPI + "/contacts/:name", (request, response) => {
    var nameParam = request.params.name;
    var contact = contacts.filter((c) => {
        return c.name.toLowerCase() == nameParam.toLowerCase();
    })[0];
    if (contact == null) {
        response.sendStatus(404);
    }else{
        response.send(contact);   
    }
    console.log("GET /contacts/" + nameParam);
});

app.post(baseAPI + "/contacts", (request, response) => {
    var contact = request.body;
    contacts.push(contact);
    response.sendStatus(201);
    console.log("POST /contacts");
});

app.post(baseAPI + "/contacts/:name", (request, response) => {
    response.sendStatus(405);
    console.log("POST /contacts/name not allowed");
});

app.put(baseAPI + "/contacts", (request, response) => {
    response.sendStatus(405);
    console.log("PUT /contacts not allowed");
});

app.put(baseAPI + "/contacts/:name", (request, response) => {
    var nameParam = request.params.name;
    var contact = request.body;
    contacts = contacts.map((c) => {
        if(nameParam.toLowerCase() == c.name.toLowerCase()){
            c = contact;
        }
    });
    response.sendStatus(200);
    console.log("PUT /contacts/"+nameParam);
});

app.delete(baseAPI + "/contacts", (request, response) => {
    contacts = [];
    response.sendStatus(200);
    console.log("DELETE /contacts");
});

app.delete(baseAPI + "/contacts/:name", (request, response) => {
    var nameParam = request.params.name;
    var contact = contacts.filter((c) => {
        return c.name.toLowerCase() == nameParam.toLowerCase();
    })[0];
    var index = contacts.indexOf(contact);
    if (contact == null) {
        response.sendStatus(404);
    }else{
        contacts = contacts.splice(index, 1);
        response.send(contact);   
    }
    console.log("DELETE /contacts/" + nameParam);
});

app.listen(port, () => {
    console.log("Server up and running");
});
