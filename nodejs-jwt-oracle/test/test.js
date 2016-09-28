/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-27 09:36:25
 * @version $Id$
 */
var http = require('http');
var qs = require('querystring');
 
var params = {username:"15555555555",password:"96e79218965eb72c92a549dd5a330112"};
var post_data = qs.stringify(params);

var options = {
    host: '192.168.1.103',
    port: 3000,
    path: '/user/login',
    method: 'POST',
    headers: {
    	'Content-Type': 'application/x-www-form-urlencoded',
    	'Content-Length': post_data.length,
    	'x-access-token': ''
    }
};
 
var req = http.request(options, function (res) {
	res.setEncoding('utf-8');
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.on('data',function (chunk) {
        console.log('BODY: ' + chunk);
        var res =  JSON.parse(chunk);
        var user = JSON.parse(res.param);
        var token = user.token;
        var refreshToken = user.refreshToken; 
        var params1 = {userId:"00250111",VERSION_CODE:"ANDROID_DRIVER"};
        var post_data1 = qs.stringify(params1);
        var options1 = {
		    host: '192.168.1.103',
		    port: 3000,
		    path: '/version/getVersion',
		    method: 'POST',
		    headers: {
		    	'Authorization': 'Bearer '+ token,
		    	'Content-Type': 'application/x-www-form-urlencoded',
		    	'Content-Length': post_data1.length
		    	
		    }
		};
		console.log(options1);
		var req1 = http.request(options1, function (res) {
			res.setEncoding('utf-8');
			res.on('data',function (chunk) {
				console.log('BODY: ' + chunk);
			});
		});

		req1.write(post_data1);

		req1.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		req1.end();
	});
});


req.write(post_data);
 
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();

console.log('post test finish');
