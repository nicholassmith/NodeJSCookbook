var connect = require('connect')
var form = require('fs').readFileSync('form.html');
var formidable = require('formidable');

connect(connect.limit('64kb'), connect.bodyParser(), function(request, response) {
	if(request.method === "POST") {
		var incoming = new formidable.IncomingForm();
		incoming.uploadDir = "uploads";
		incoming.on('file', function(field, file) {
			if(!file.size) {return;}
			response.write(file.name + " received\n");
		}).on('end', function () {
			response.end("All files received");
		});
		incoming.parse(request);
	}
	if(request.method === "GET") {
		response.writeHead(200, {'Content-Type' : 'text/html'});
		response.end(form);
	}
}).listen(8080);