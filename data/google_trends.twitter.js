var http = require('http');
var xml2js = new (require('xml2js')).Parser();
var colors = require('colors');
var trendingTopics = require('./twitter_trends');

var hotTrends = Object.create(trendingTopics, {trends: { value: 
	{ urlOpts: {
		host: 'www.google.com',
		path: '/trends/hottrends/atom/hourly/',
		headers: {'User-Agent': 'Node Cookbook'}
	}
}}});

hotTrends.xmlHandler = function(response, cb) {
	var hotTrendsFeed = '';
	response.on('data', function(chunk) {
		hotTrendsFeed += chunk;
	}).on('end', function() {
		xml2js.parseString(hotTrendsFeed, function(err, obj) {
			if(err) { throw (err.message); }
			xml2js.parseString(obj.entry.content['#'], function(err, obj) {
				if(err) {throw (err.message)}
				cb(encodeURIComponent(obj.li[0].span.a['#']));
			});
		});
	});
};

function makeCall(urlOpts, handler, cb) {
	http.get(urlOpts, function(response) {
		handler(response, cb);
	}).on('error', function(e) {
		console.log("Connection Error: " + e.message);
	});
}

makeCall(hotTrends.trends.urlOpts, hotTrends.xmlHandler, function(query) {
	hotTrends.tweetPath(query);
	makeCall(hotTrends.tweets.urlOpts, hotTrends.jsonHandler, function(tweetsObj) {
		tweetsObj.results.forEach(function(tweet) {
			console.log("\n" + tweet.from_user.yellow.bold + tweet.text);
		});
	});
});