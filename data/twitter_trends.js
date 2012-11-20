var http = require('http');
var colors = require('colors');

var trendingTopics = module.exports = { 
	trends: { 
		urlOpts: {
			host: 'api.twitter.com',
			path: '/1/trends/1.json', 
			headers: {'User-Agent': 'Node-Cookbook: Twitter-Trends'}
		}
	},
	tweets: {
		maxResults: 3,
		resultsType: 'realtime',
		language: 'en',
		urlOpts: {
			host: 'search.twitter.com',
			headers: {'User-Agent' : 'Node-Cookbook: Twitter-Trends'}
		}
	},
	jsonHandler: function(response, cb) {
		var json = '';
		response.setEncoding('utf8');
		if(response.statusCode === 200) {
			response.on('data', function(chunk) {
				json += chunk;
			}).on('end', function() {
				cb(JSON.parse(json));
			});
		} else {
			throw("Server returned errorcode: " + response.statusCode);
		}
	},
	tweetPath: function(q) {
		var p = '/search.json?lang=' + this.tweets.language + '&q=' + q + '&rpp=' + this.tweets.maxResults + '&include_entities=true' + '&with_twitter_user_id=true&result_type=' + this.tweets.resultsType;
		this.tweets.urlOpts.path = p;
	}
};

function makeCall(urlOpts, cb) {
	http.get(urlOpts, function(response) {
		//make API call
		trendingTopics.jsonHandler(response, cb);
	}).on('error', function(e) {
		console.log("Connection Error: " + e.message);
	})
}

makeCall(trendingTopics.trends.urlOpts, function(trendsArr) {
	trendingTopics.tweetPath(trendsArr[0].trends[0].query);
	makeCall(trendingTopics.tweets.urlOpts, function(tweetsObj) {
		tweetsObj.results.forEach(function(tweet) {
			console.log("\n" + tweet.from_user.yellow.bold + ": " + tweet.text);
		});
	});
});