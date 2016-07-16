/*
	An easy Node.js package for work with Faragate Online Payment api.
	Developer: Erfan Sahafnejad
	Email: Erfan.Sahaf@gmail.com
	Github: http://github.com/erfansahaf/
	License: Apache License V2.0
*/ 
module.exports = {
	request: require("request"),
	paymentRequest: function(res, merchantCode, rialPrice, returnUrl, invoiceNumber, options){
		options = options || {};
		options.MerchantCode = merchantCode;
		options.PriceValue = rialPrice;
		options.ReturnUrl = returnUrl;
		options.InvoiceNumber = invoiceNumber;

		if(options.PaymenterEmail)
			if(options.PaymenterEmail.match(/([\w\-]+\@[\w\-]+\.[\w\-]+)/) == null)
				delete options.PaymenterEmail;
		if(options.PaymenterMobile)
			if(options.PaymenterMobile.match(/^09[0-9]{9}/) == null)
				delete options.PaymenterMobile;

		this.request.post({
			url:'http://faragate.com/services/paymentRequest.json', 
			form: JSON.stringify(options)}, function(err,response,body){
			if(err){
				res.end(JSON.stringify(err));
				return;
			}
			body = JSON.parse(body);
			if(body.Status == 1){
				var finalUrl = "https://faragate.com/services/";
				finalUrl += options.SandBox==true?"payment_test/":"payment/";
				finalUrl += body.Token;
				console.log("Final", finalUrl);
				res.writeHead(302, {"location": finalUrl});
				res.end();	
				// res.redirect(finalUrl);
			}
			else{
				var msg ="<html><head><meta charset='utf-8'></head><body>";
				msg += "ERR-No: " + body.Status;
				if(body.Message)
					msg += "<br>Message: " + body.Message;
				msg += "</body></html>"
				res.end(msg);
			}
		});
	},
	verifyPayment: function(merchantCode, token, callback, sandbox){
		sandbox = sandbox || false;
		var data = {};
		var url = "http://faragate.com/services/paymentVerify.json";
		var success = false;
		data.MerchantCode = merchantCode;
		data.Token = token;
		data.SandBox = sandbox;
		this.request.post({url: url, form: JSON.stringify(data)}, function(err, response, body){
			if(err){
				callback(success, 0, "خطا در ارسال اطلاعات به سرور فراگیت");
				return;
			}
			body = JSON.parse(body);
			if(body.Status == 1){
				success = true;
				body.Message = "پرداخت با موفقیت انجام شد.";
			}
			callback(success, body.Status, body.Message);
		});
	},
	getBalance: function(username, password, callback){
		var data = {Username: username, WsPassword: password};
		var url = "http://faragate.com/services/accountBalance.json";
		this.request.post({url: url, form: JSON.stringify(data)}, function(err, response,body){
			if(err){
				callback(null, -3, "مشکل در ارتباط با سرور فراگیت.");
				return;
			}
			body = JSON.parse(body);
			callback(body.AccountBalance, body.Status, "موجودی حساب با موفقیت دریافت شد.");
		});
	}
}
