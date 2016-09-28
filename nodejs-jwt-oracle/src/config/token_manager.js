var redisClient = require('./redis_database').redisClient;
var utils = require('../utils/utils');
var message = require('./message_config').message;
var code = require('./message_config').code;
var TOKEN_EXPIRATION = 60;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

// Middleware for token verification
exports.verifyToken = function (req, res, next) {
	var token = getToken(req.headers);
	var userId = req.body.userId || req.query.userId;
	redisClient.get('token_'+userId, function (err, reply) {
		if (err) {
			console.error('redis数据库出错');
			utils.setResult(code.OAUTH_SERVER_ERROR,message.OAUTH_SERVER_ERROR, function(resJson) {
				return res.json(resJson);
			});
		}
		if (!reply) {
			utils.setResult(code.OAUTH_TIMEOUT,message.OAUTH_TIMEOUT, function(resJson) {
				return res.json(resJson);
			});
		} else {
			if (token != reply) {
				utils.setResult(code.OAUTH_ERROR,message.OAUTH_ERROR, function(resJson) {
					return res.json(resJson);
				});
			}
			next();
		}
	});
};

exports.setToken = function (userId, token) {
    redisClient.set('token_'+userId,token);
	redisClient.set('refresh_token_'+userId,utils.createRefreshToken(token));
	redisClient.expire('token_'+userId, TOKEN_EXPIRATION_SEC);
}

exports.deltoken = function (req) {
	var userId = req.body.userId || req.query.userId;
	redisClient.del('token_' + userId );
	redisClient.del('refresh_token_' + userId );
};

exports.getExpire = function (key, cb) {
	if (typeof key != 'undefined') {
		key = "token_" + key;
		redisClient.ttl(key, function (err , data) {
			if (err) {
				console.log('redis: key[' + key + '] not exits');
			}
			if(typeof data == 'undefined' || data == '') {
				data = 0;
			}
			cb(data);
		});
	} else {
		cb(0);
	}
	
}

exports.refreshToken = function (req, res, cb) {
	var refreshToken = req.body.refreshToken || req.query.refreshToken;
	var userId = req.body.userId || req.query.userId;
	redisClient.get('refresh_token_'+userId, function (err, reply) {
		if (err) {
			console.error('redis数据库出错');
			utils.setResult(code.OAUTH_SERVER_ERROR,message.OAUTH_SERVER_ERROR, function(resJson) {
				return res.json(resJson);
			});
		}
		if (!reply) {
			utils.setResult(code.OAUTH_TIMEOUT,message.OAUTH_TIMEOUT, function(resJson) {
				return res.json(resJson);
			});
		} else {
			if (refreshToken != reply) {
				utils.setResult(code.OAUTH_ERROR,message.OAUTH_ERROR, function(resJson) {
					return res.json(resJson);
				});
			} else {
				cb(reply);
			}
			
		}
	});
}

var getToken = function (headers) {
	console.log(headers);
	if (headers && headers.authorization) {
		var authorization = headers.authorization;
		var part = authorization.split(' ');

		if (part.length == 2) {
			var token = part[1];

			return part[1];
		}
		else {
			return null;
		}
	}
	else {
		return null;
	}
};

exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;