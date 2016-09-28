/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-22 11:44:15
 * @version $Id$
 */
var jwt = require('jsonwebtoken');
var secret = require('../../config/secret');
var redisClient = require('../../config/redis_database').redisClient;
var oraUtils = require('../../config/oracle_database');
var tokenManager = require('../../config/token_manager');
var userDb = require('../../dao/user');
var utils = require('../../utils/utils');
var async = require('async');
var message = require('../../config/message_config').message;
var code = require('../../config/message_config').code;

exports.login = function(req, res) {

	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '') { 
		utils.setResult(code.SERVICE_ERROR,'用户名或密码不能为空', function(resJson) {
			return res.json(resJson);
		});
	} else {
		a;
		async.waterfall([
			function (cb) {
				oraUtils.getConnection(username, cb);
			},
			function (conn, params, cb) {
				userDb.getUserInfo(conn, params, cb);
			}
		], function (err, conn, result) {
			oraUtils.doRelease(conn);
			if (err) {
				console.log("/user/login:error " + err.message);
				utils.setResult(code.SERVICE_ERROR,'服务器异常', function(resJson) {
					return res.json(resJson);
				});
			} else {
				var user = result;
				if (user == undefined) {
					utils.setResult(code.SERVICE_ERROR,'用户名不存在', function(resJson) {
						return res.json(resJson);
					});
				}

				password = utils.md5(password);

				if (password != user.PASSWORD) {
					utils.setResult(code.SERVICE_ERROR,'用户名或密码错误', function(resJson) {
						return res.json(resJson);
					});
				} else {
					var token = jwt.sign({id: user.USER_ID}, secret.secretToken, { expiresIn: tokenManager.TOKEN_EXPIRATION_SEC });
					user.token = token;
					user.refreshToken = utils.createRefreshToken(token);
					tokenManager.setToken(user.USER_ID, token);
					utils.setResult(code.OPER_SUCCESS,'登录成功',user.USER_ID, user, function(resJson) {
						return res.json(resJson);
					});
				}
			}
			
		});
	}

	
}

exports.authorization = function (req, res) {
	var userId = utils.getUserId(req);
	tokenManager.refreshToken(req, res, function (reply) {
		var token = jwt.sign({id: userId}, secret.secretToken, { expiresIn: tokenManager.TOKEN_EXPIRATION_SEC });
		var tokenInfo = {
			token : token,
			refreshToken : utils.createRefreshToken(token),
			userId : userId
		};
		tokenManager.setToken(userId, token);
		utils.setResult(code.OPER_SUCCESS,message.OPER_SUCCESS, userId, tokenInfo, function(resJson) {
			return res.json(resJson);
		});
	});

	
}

exports.logout = function(req, res) {
	var userId = utils.getUserId(req);
	if (req.user) {
		tokenManager.deltoken(userId);
		delete req.user;	
		utils.setResult(code.OPER_SUCCESS,message.OPER_SUCCESS, function(resJson) {
			return res.json(resJson);
		});
	}
	else {
		return res.send(401);
	}
}

exports.modifyPwd = function (req, res) {
	var userId = utils.getUserId(req);
	
	var newPwd = req.body.newPwd || req.query.newPwd;
	var oldPwd = req.body.oldPwd || req.query.oldPwd;
	if (userId == '' || newPwd == '') { 
		utils.setResult(code.SERVICE_ERROR,'参数错误', userId, function(resJson) {
			return res.json(resJson);
		});
	} else {
		newPwd = utils.md5(newPwd);
		async.waterfall([
			function (cb) {
				oraUtils.getConnection(userId, cb);
			},
			function (conn, params, cb) {
				userDb.getUserInfoById(conn, params, cb);
			},
			function (conn, user, cb) {
				var dbPwd = user.PASSWORD;
				if (dbPwd != oldPwd) {
					var err = {
						code : code.SERVICE_ERROR,
						message : '原始密码错误'
					}
					cb(err, conn, null);
				}else {
					userDb.modifyPwd(conn, userId, newPwd, cb);
				}
			}
		], function (err, conn, result) {
			oraUtils.doRelease(conn);
			if (err) {
				if (err.code == code.SERVICE_ERROR) {
					utils.setResult(err.code,err.message, function(resJson) {
						return res.json(resJson);
					});
				} else {
					console.log("/user/modifyPwd:error " + err.message);
					utils.setResult(code.SERVICE_ERROR,'服务器异常', function(resJson) {
						return res.json(resJson);
					});
				}
			} else {
				var count = result;
				if (count == 1) {
					utils.setResult(code.OPER_SUCCESS,message.OPER_SUCCESS, userId, function(resJson) {
						return res.json(resJson);
					});
				} else {
					utils.setResult(code.SERVICE_ERROR,'密码修改失败', userId, function(resJson) {
						return res.json(resJson);
					});
				}
			}
		});
	}
}


