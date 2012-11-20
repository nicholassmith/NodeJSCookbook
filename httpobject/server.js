var connect = require('connect')
var form = require('fs').readFileSync('form.html');
var util = require('util');

connect(connect.limit('64kb'), connect.bodyParser(), function(request, response) {
	if(request.method === "POST") {
		console.log("User posted:\n", request.body);
		response.end("You posted:\n", util.inspect(request.body));
	}
	if(request.method === "GET") {
		response.writeHead(200, {'Content-Type' : 'text/html'});
		response.end(form);
	}
}).listen(8080);