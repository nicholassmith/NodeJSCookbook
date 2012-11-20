var http = require('http');
var form = require('fs').readFileSync('form.html');
var querystring = require('querystring');
var util = require('util');
var maxData = 2 * 1024 * 1024;

http.createServer(function(request, response) {
	if(request.method === "POST") {
		var postData = '';
		request.on('data', function(chunk) {
			postData += chunk;
			if(postData.length < maxData) {
				postData = '';
				this.pause();
				response.writeHead(413);
				response.end('Too Large');
			}
		}).on('end', function() {
			if(!postData) {response.end(); return;}
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