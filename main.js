const restify = require('restify');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');


function render(req, res, next) {
	/* Using for rendering main page html with form */
	var body = fs.readFileSync("./index.html").toString();
	res.writeHead(200, {
	  'Content-Length': Buffer.byteLength(body),
	  'Content-Type': 'text/html'
	});
	res.write(body);
	res.end();
}

function getPrice(req, res, next) {
	const url = req.body.url;
	if (url===null) {
		res.send ({"response" : "error", "body" : "Url error"});
		return 0;
	}
	request(url, function (error, response, body) {
		if (error === null) {
			var $ = cheerio.load(body);
			var title = $('.n-title__text h1').text();
			try {
				var price = $('.n-w-product-average-price__value')[0].children[1].children[0].data
			} catch (ParseError) {
				res.send ({"response" : "error", "body" : "Couldn't find item price, check url"});
				return 0;
			}
			res.send({"response" : "success",
			 "data" : {"url" : url, "title" : title, "lowest_price" : price}})
		} else {
			res.send ({"response" : "error", "body" : error.toString()});
		}
		
	});
}

function getContent(req, res, next) {
	const url = req.body.url;
	if (url===null) {
		res.send ({"response" : "error", "body" : "Url error"});
		return 0;
	}
	request(url, function (error, response, body) {
		if (error === null) {
			res.send({"response" : "success",
			 "data" : {"html" : body}})
		} else {
			res.send ({"response" : "error", "body" : error.toString()});
		}
		
	});
}


var server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.get('/', render);
server.post('/price', getPrice)
server.post('/content', getContent)

server.listen(8080,/* '0.0.0.0',*/ function() {
  console.log('%s listening at %s', server.name, server.url);
});
