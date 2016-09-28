/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-23 14:46:05
 * @version $Id$
 */
var oracledb = require('oracledb');

var dbConfig = {
  user          : 'znc_tms_zy',
  password      : 'znc_tms_zy',
  connectString : '192.168.1.224/orcl',
}

exports.init = function () {
	oracledb.createPool({
		user: dbConfig.user,
		password: dbConfig.password,
		connectString: dbConfig.connectString,
		poolMax: 4, // maximum size of the pool
		poolMin: 0, // let the pool shrink completely
		poolIncrement: 1, // only grow the pool by one connection at a time
		poolTimeout: 0  // never terminate idle connections
	})
    .then(function(pool) {
        console.error("createPool() success ");
    })
    .catch(function(err) {
        console.error("createPool() error: " + err.message);
    });
    oracledb.outFormat = oracledb.OBJECT;
}

exports.getConnection = function (params, cb) {
	var pool = oracledb.getPool();
	pool.getConnection(function (err,conn) {
		if (err) {
			console.log('getConnection error: ' + err.message);
			return cb(err, conn, null);
		} else {
			return cb(null, conn, params);
		}
	});
}

exports.execute = function (conn, sql, params, cb, auto) {
	if (typeof auto == 'undefined') {
		auto = 'true';
	}
	console.log('=====execute_sql====' + sql);
	console.log('=====execute_params=====',params)
	conn.execute(sql,params,{autoCommit: auto}, function(err, result) {
        if (err) {
        	cb(err, conn, null)
    	} else {
    		cb(null, conn, result.rowsAffected)
    	}
  	});
}

exports.queryForList = function (conn, sql, params, cb) {
	console.log('=====query_sql====' + sql);
	console.log('=====query_params=====',params)
	conn.execute(sql,params,{autoCommit: true}, function(err, result) {
    	if (err) {
    		cb(err, conn, null);
    	} else {
    		cb(null, conn, result);
    	}
    });
}

exports.queryForObject = function (conn, sql, params, cb) {
	console.log('=====query_sql====' + sql);
	console.log('=====query_params=====',params)
	conn.execute(sql,params,{autoCommit: true}, function(err, result) {
    	if (err) {
    		cb(err, conn, null);
    	} else {
    		cb(null, conn, result.rows[0]);
    	}
	});
}

exports.executeProc = function (conn, sql, bindvars, cb) {
	console.log('=====proc_sql====' + sql);
	console.log('=====proc_bindvars=====',bindvars)
	conn.execute(sql,bindvars,{autoCommit: true}, function(err, result) {
    	if (err) {
    		cb(err, conn);
    	} else {
    		cb(null, conn);
    	}
    });
}

exports.batchExecute = function (conn, sql, params, cb, auto) {
	if (typeof auto == 'undefined') {
		auto = true;
	}
	var innerAuto = false;
	console.log('=====batch_sql====' + sql);
	console.log('=====batch_params=====',params);
	var plength = params.length;
	var exeSql = function (conn, i) {
		if(i < plength) {
			var vars = params[i];
			if(i == plength - 1 && auto) {
				innerAuto = true;
			}
			conn.execute(sql,vars,{autoCommit: innerAuto}, 
		        function(err, result){
		        	if (err) {
		        		cb(err, conn, null);
		        	} else {
		        		exeSql(conn, ++i);	
		        	}
		     	}
		    );
		} else {
			cb(null, conn, 1);
		}
		
	}
	exeSql(conn, 0);
}

exports.doRelease = function (conn) {
	conn.release(function (err) {
	 	if (err) 
	 		console.error('db connection release error :' + err.message);
	});
}
