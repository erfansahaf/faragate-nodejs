**Faragate Node.js Module**
----------------------------

This package is made for [Faragate.com](http://faragate.com) website that allows developers to work with Faragate Online Payment APIs quickly and easily in node.js!
## Dependencies
This module is depentet on following packages:

 - Request
 - body-parser (Use POST input parameters)

## How to install
For install this package, run below command:

    $ npm install faragate --save
Now you can use package's methods by require it:

    var faragate = require("faragate");
## Methods
### paymentRequest:
paramaters:

 - **res**: The response (res) variable of your Framework in routing request scope.
 - **merchantCode**: Your unique Faragate merchant code.
 - **rialPrice**: Product price in Rial (ريال) format.
 - **returnUrl**: After complete payment processes, user will redirect to this url and Faragate web service, will POST payment's status to the URL.
 - **invoiceNumber**: The unique ProductID or InvoiceNumber.
 - **options**: Other Faragate REST-API options in key-value object format. SandBox for testing, Paymenter Name/Email/Mobile and etc. (See [this link](https://faragate.com/files/uploads/plugin/8/Rest%20&amp;%20cURL%20&amp;%20file_get_contents.pdf) for more information)

Example in Express (Production Mode):
```
var faragate = require("faragate");
var marchent = "YOUR_MARCHENT_CODE";
    
app.get('/pay', function(req, res){
	faragate.paymentRequest(res, marchent, "RIAL_PRICE", "http://YOUR_WEBSITE.com/pay","INVOICE_NUMBER", {PaymenterName: "Erfan Sahafnejad"});
});    
```

> **Important note**: Never send any response like res.end and res.send in this route, paymentRequest will send response automatically.

----------


### verifyPayment:
After call paymentRequest, you should use this method for check user payment status in your callback page (in POST method). If user returned to your callback url from Faragate gateway, you have a Token variable in your header.

paramaters:

  - **merchantCode**: Your unique Faragate merchant code.
  - **token**: The Token that Faragate will post to your callback. (Accessible from req.body.Token, don't forget that Body-Parser package is required.)
  - **cb**: Your async function for handle user payment status. This function has 3 input:
	  - **State|Bool**: if payment was successful will be True otherwise, will be False
	  - **StatusCode|Integer**: if payment was successful will have value 1, otherwise will containing error code that is a negative number
	  - **Message|String**: A string that is containing payment status text
  - **sandbox**: If you are in developing mode and you want test your code, put it true otherwise in production mode, should be false. Default value is False.
  
  

Example in Express (Production Mode):
```
var faragate = require("faragate");
var marchent = "YOUR_MARCHENT_CODE";
    
app.get('/', function(req, res){
	faragate.paymentRequest(res, marchent, "10000", "http://YOUR_WEBSITE.com/pay","0123456789", {PaymenterName: "Erfan Sahafnejad"});
});    

app.post("/pay", function(req, res){
    var token = req.body.Token;
    faragate.verifyPayment(marchent, token, function(status, code, message){
        var text = "Payment status: " + status + "<br>Code: " + code + "<br>Message: " + message;
        res.send(text);
    });
});

```


----------
### getBalance:
You can use this function to get your account balance in Rial format. Remember you wille need Faragate WebService Password for working with this method. For set Web Service Password see [this link](https://faragate.com/user/users/change_password).

paramaters:

  - **username**: Your Faragate username.
  - **password**: Your Faragate Web Service Password.
  - **cb**: Async callback function with 3 input parameters:
	  - **Balance|Integer**: Account balance in Rail format.
	  - **Status|Integer**: Response status code.
	  - **Message|String**: Response message text.

Example in Express (Production Mode):
```
var faragate = require("faragate");
var marchent = "YOUR_MARCHENT_CODE";
    
app.get('/balance', function(req, res){
    faragate.getBalance("USERNAME", "PASSWORD", function(balance, code, message){
      res.send(balance + " Rial" + "<br>Message: " + message);
    });
});
```

## License
This package is under Apache License 2.0