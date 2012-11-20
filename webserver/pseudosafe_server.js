var http = require('http');
var path = require('path');

var url = require('url');
var fs = require('fs');

var whitelist = [
	'/index.html',
	'/subcontent/styles.css',
	'/subcontent/script.js'
];

http.createServer(function (request, response) {
	var lookup = url.parse(decodeURI(request.url)).pathname;
	lookup = path.normalize(lookup);
	lookup = (lookup === "/") ? 'index.html-serve' : lookup + '-serve';
	var f = 'content-pseudosafe' + lookup;
	console.log(f);
	fs.exists(f, function(exists) {
		if(whitelist.indexOf(lookup) === -1) {
			response.writeHead(404);
			response.end('Page Not Found Ha');
			return;
		}
		fs.readFile(f, function(err, data) {
			response.end(data);
		});
	});
}).listen(8080);