var http = require('http');
var form = require('fs').readFileSync('form.html');
var querystring = require('querystring');
var util = require('util');

http.createServer(function(request, response) {
	if(request.method === "POST") {
		var postData = '';
		request.on('data', function(chunk) {
			postData += chunk;
		}).on('end', function() {
			var postDataObject = querystring.parse(postData);
			console.log('User posted:\n' + postData);
			response.end('You posted:\n' + util.inspect(postDataObject));
		});
	}
	if(request.method === "GET") {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(form);
	}
}).listen(8080);