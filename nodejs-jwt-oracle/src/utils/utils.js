/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-23 16:31:38
 * @version $Id$
 */
var crypto = require('crypto');
var tokenManager = require('../config/token_manager');

var utils = {
	md5 : function (text) {
		return crypto.createHash('md5').update(text).digest('hex');
	},
	setResult : function (status, resInfo, userId, params, cb) {
		var fn = arguments[arguments.length - 1]
		if (typeof params == 'undefined' && typeof params != 'function') {
			params = '';
		}
		tokenManager.getExpire(userId, function (expire) {
			var res = {status : status , resInfo : resInfo , expire : expire, param : JSON.stringify(params)};
			fn(res)
		});

	},
	createRefreshToken : function (token) {
		return this.md5(token);
	},
	getUserId : function (req) {
		return req.body.userId || req.query.userId;
	}
}

module.exports = utils;