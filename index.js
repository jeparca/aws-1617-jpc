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

db.insert([{
        name: "pepe",
        phone: "12345",
        email: "pepe@pepe.com"
    },{
        name: "luis",
        phone: "1245",
        email: "luis@pepe.com"
    }]);

var baseAPI = "/api/v1";


app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get(baseAPI + "/contacts", (request, response) => {
    db.find({}, (err, contacts) => {
        response.send(contacts);    
    });
    
    console.log("GET /contacts");
});

app.get(baseAPI + "/contacts/:name", (request, response) => {
    console.log("GET /contacts/" + nameParam);
    var nameParam = request.params.name;
    
    db.find({name:nameParam}, (err,contacts) => {
        if(contacts.length == 0)
            response.sendStatus(404);
        else
            response.send(contacts[0]);
    });


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
    console.log("PUT /contacts/"+nameParam);
    db.update({name:nameParam},contact, {}, (err,numUpdates) => {
        console.log("Contacts updated: "+numUpdates);
        if(numUpdates == 0){
            request.sendStatus(404);
        }else{
            response.sendStatus(200);
        }
    });
    
    
});

app.delete(baseAPI + "/contacts", (request, response) => {
    console.log("DELETE /contacts");
    db.remove({}, {multi:true}, (err, numRemoved) => {
        console.log("Contacts removed: "+ numRemoved);
        response.sendStatus(200);
    });
});

app.delete(baseAPI + "/contacts/:name", (request, response) => {
    var nameParam = request.params.name;
    console.log("DELETE /contacts/" + nameParam);
    db.remove({name:nameParam}, {multi:true}, (err, numRemoved) => {
        if (numRemoved == 0) {
            response.sendStatus(404);
        }else{
            console.log("Contacts removed: "+ numRemoved);
            response.sendStatus(200);
        }
    });
});

app.listen(port, () => {
    console.log("Server up and running");
});
