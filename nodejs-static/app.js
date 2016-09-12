/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-09 17:06:02
 * @version $Id$
 */

var http = require('http');
var url = require('url');
var PORT = 8080;
var fs = require('fs');
var mine = require('./mine');
var path = require('path');
var Tools = require('./Tools');
var config = require('./config');
var zlib = require("zlib");
var server = http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  var guessPage = Tools.guessPage(fs, path, process.cwd(),pathname);
  var realPath = guessPage.realPath;
  var ext = guessPage.ext;
	fs.exists(realPath, function(exists) {
		if(!exists) {
			res.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			res.write("This request URL " + realPath + " was not found on this server.");
			res.end();
		} else {
      var contentType = mine.types[ext] || "text/plain";
      res.setHeader("Content-Type", contentType);  
      fs.stat(realPath, function (err, stat) {
          var lastModified = stat.mtime.toUTCString();
          var ifModifiedSince = "If-Modified-Since".toLowerCase();
          res.setHeader("Last-Modified", lastModified);
          if (ext.match(config.Expires.fileMatch)) {
              var expires = new Date();
              expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
              res.setHeader("Expires", expires.toUTCString());
              res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
          }
          if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
            res.writeHead(304, "Not Modified");
            res.end();
          } else {
            var raw = fs.createReadStream(realPath);
            var acceptEncoding = req.headers['accept-encoding'] || "";
            var matched = ext.match(config.Compress.match);
            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                res.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});
                raw.pipe(zlib.createGzip()).pipe(res);
            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                res.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});
                raw.pipe(zlib.createDeflate()).pipe(res);
            } else {
                res.writeHead(200, "Ok");
                raw.pipe(res);
            }
          }
      });
		}
	});
});
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
