/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-05 15:48:10
 * @version $Id$
 */
var http = require('http');
var equal = require('assert').equal;
var lingdoong = require('./plugin/lingdoong');
 
var username = "13022996666";
var params = {api_serialNo:"1608011235448789212",api_orderId:"2016052710200",api_token:"Y7MyJsSuSwVxqGh49uAHIkV9Zk/qqiUtMfwI+X0Oe8KFDDKjp0oL3A=="};

var post_data = lingdoong.setPost(username, params);
console.log("test",post_data);
 
var options = {
    host: 'file.wodiantong.com',
    port: 80,
    path: '/woEasy_file/api/baifm/getOrders',
    method: 'POST',
    headers: {
    	'Content-Type': 'application/x-www-form-urlencoded',
    	'Content-Length': post_data.length,
    }
};
 
var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    //equal(200, res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
 
    res.on('data',function (chunk) {
         console.log('BODY: ' + chunk);
    });
});


req.write(post_data);
 
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();