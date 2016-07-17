/*
  An easy Node.js package for work with Faragate Online Payment api.
  Developer: Erfan Sahafnejad
  Email: Erfan.Sahaf@gmail.com
  Github: http://github.com/erfansahaf/
  License: Apache License V2.0

  This sample is on Development mode. For production see faragate-nodejs github repository.
*/
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var faragate = require("./faragate");

var app = express();
var marchent = "YOUR_MARCHENT_CODE";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    faragate.paymentRequest(res, marchent, "10000", "http://localhost:3000/","0123456789", {SandBox:true});
});
app.post("/", function(req, res){
    var token = req.body.Token;
    var sandBox = req.body.SandBox ? true : false;
    // You can get invoice number of previous payment request by req.body.InvoiceNumber
    var invoiceNumber = req.body.InvoiceNumber;

    faragate.verifyPayment(marchent, token, function(status, code, message){
        var text = "Payment status: " + status + "<br>Code: " + code + "<br>Message: " + message;
        res.send(text);
    }, sandbox);
})

app.get('/balance', function(req, res){
    faragate.getBalance("username", "password", function(balance, code, message){
      res.send(balance + " Rial" + "<br>Message: " + message);
    });
});

app.listen(3000, function(){console.log("Server is running...");})

module.exports = app;
