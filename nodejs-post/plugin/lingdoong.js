/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-08 14:29:50
 * @version $Id$
 */
var crypto = require('crypto'); 
var qs = require('querystring');
var moment = require("moment");

var lingdoong = {
	key : 'WOEASYPD',
	encryptByDES : function(message) {
		var keys = new Buffer(this.key);
		var vi = new Buffer(this.key);
		var cipher = crypto.createCipheriv('des-cbc', keys, vi);  
	    cipher.setAutoPadding(true);
	    var ciph = cipher.update(message, 'utf8', 'base64');  
	    ciph += cipher.final('base64'); 
	    return ciph;
	},
	digest : function(key,params) {
		var content = this.keysrt(params);
		content = new Buffer(content);
		var str = crypto.createHmac('sha256', key).update(content).digest().toString('hex');
		console.log(str);
		return str;
	},
	keysrt : function(params) {
		var keys = new Array();
		for(var i in params){
			keys.push(i);
		}
		keys.sort();
		var values = "";
		for(var i in keys){
			values += params[keys[i]];
		}
		console.log(values)
		return values;
	},
	setPost : function(username, params) {
		params['username'] = username;
		var date1 = moment().format('YYYYMMDD');
		var date2 = moment().format('HHmmss');
		var token = date1 + "_woEasy_" + username + "_token_" + date2;
		token = this.encryptByDES(token);
		params['clientKey'] = token;
		var digest = this.digest(token,params);
		params['digest'] = digest;
		var post_data = qs.stringify(params);
		return post_data;
	}
}

module.exports = lingdoong;