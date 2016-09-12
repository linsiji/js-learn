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
var params = {api_serialNo:"1608011235448789212",api_userName:"张老师",api_telephone:"13022995566",api_idCard:"610302198532615478",api_bankCard:"6222600810011012345",api_creditLvl:"3"};

var post_data = lingdoong.setPost(username, params);
console.log("test",post_data);
 
var options = {
    host: '127.0.0.1',
    port: 8080,
    path: '/test/api/baifm/register',
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