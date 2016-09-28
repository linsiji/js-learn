/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-28 11:56:26
 * @version $Id$
 */

var message = {
	OPER_SUCCESS : '操作成功',
	OPER_ERROR : '服务器异常',
	OAUTH_ERROR : '授权失败',
	OAUTH_TIMEOUT : '授权失效',
	OAUTH_SERVER_ERROR : '鉴权服务器出错'
}

var code = {
	OPER_SUCCESS : '0000',
	SERVICE_ERROR: '0001',
	OPER_ERROR : '9999',
	OAUTH_ERROR : '9998',
	OAUTH_TIMEOUT: '9997',
	OAUTH_SERVER_ERROR: '9996' 
}

var message_config = {message:message, code:code};

module.exports = message_config;
