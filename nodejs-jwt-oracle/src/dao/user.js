/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-23 15:05:34
 * @version $Id$
 */
var oraUtils = require('../config/oracle_database');

exports.getUserInfo = function (conn, id, cb) {
	oraUtils.queryForObject(conn, "SELECT driver_id user_id, link_phone, user_name, app_password password "
				    + "FROM bd_driver "
				    + "WHERE link_phone = :did", [id], cb);
}

exports.getUserInfoById = function (conn, id,cb) {
	oraUtils.queryForObject(conn, "SELECT driver_id user_id, link_phone, user_name, app_password password "
				    + "FROM bd_driver "
				    + "WHERE driver_id = :did", [id], cb);
}

exports.modifyPwd = function (conn, id, newPwd, cb) {
	oraUtils.execute(conn, "update bd_driver set app_password = :pwd where driver_id = :did", [newPwd, id], cb);
}