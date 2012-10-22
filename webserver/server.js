var http = require('http');
var path = require('path');
var fs = require('fs');
var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

var cache = {};
function cacheAndDeliver(f, cb) {
	fs.stat(f, function(err, stats) {
		var lastChanged = Date.parse(stats.ctime), 
			isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;
		if(!cache[f] || isUpdated) {
			fs.readFile(f, function(err, data) {
				console.log('loading ' + f + ' from cache');
				if (!err) {
				    cache[f] = {content: data, timestamp: Date.now()
				    };
				}
				cb(err, data);
			});
			return;
		}
		console.log('loading ' + f + ' from cache');
		cb(null, cache[f].content);
	});
}
//requires variables, mimeType object
http.createServer(function(request, response) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html',
		f = 'content/' + lookup;
	fs.exists(f, function (exists) {
		if(exists) {
			var headers = {'Content-type': mimeTypes[path.extname(f)]};
			if(cache[f]) {
				response.writeHead(200, headers);
				response.end(cache[f].content);
				return;
			}
			});
			return;
		}
		response.writeHead(404);
		response.end();
	});
}).listen(8080);