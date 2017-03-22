var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var dataStore = require("nedb");

var port = (process.env.PORT || 3000);
var app = express();
var dbFileName = path.join(__dirname, 'contacts.json');

var db = new dataStore({
    filename : dbFileName,
    autoload : true
});

var baseAPI = "/api/v1";


app.use(bodyParser.json());

app.get(baseAPI + "/contacts", (request, response) => {
    db.find({}, (err, contacts) => {
        response.send(contacts);    
    });
    
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
    
    db.insert(contact);
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
            c.phone = contact.phone;
            c.email = contact.email;
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
        response.sendStatus(200);   
    }
    console.log("DELETE /contacts/" + nameParam);
});

app.listen(port, () => {
    console.log("Server up and running");
});
