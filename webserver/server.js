var http = require('http');
var path = require('path');
var fs = require('fs');
var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

var cache = {
	store: {},
	maxSize: 26214400,
	maxAge: 5400 * 1000,
	cleanAfter: 7200 * 1000,
	cleanedAt: 0,
	clean: function(now) {
		if(now - this.cleanAfter > this.cleanedAt) {
			var that = this;
			Object.keys(this.store).forEach(function (file) {
				if(now > that.store[file].timestamp + that.maxAge) {
					delete that.store[file];
				}
			});
		}
	}
};

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
			var s = fs.createReadStream(f).once('open', function () {
				//do stuff when the stream opens
				response.writeHead(200, headers);
				this.pipe(response);
			}).once('error', function(e) {
				console.log(e);
				response.writeHead(500);
				response.end('Server Error');
			});

			fs.stat(f, function(err, stats){
				if(stats.size < cache.size) {
					var bufferOffset=0;
					cache[f] = {content : new Buffer(stats.size),
										timestamp: Date.now()};
					s.on('data', function(data){
						data.copy(cache.store[f].content, bufferOffset);
						bufferOffset += data.length;
					});
				}
			});

			return;
		}
		response.writeHead(404);
		response.end();
	});
cache.clean(Date.now());
}).listen(8080);