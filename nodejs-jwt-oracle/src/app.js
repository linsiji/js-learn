var express = require('express');
var jwt = require('express-jwt');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var tokenManager = require('./config/token_manager');
var secret = require('./config/secret');
var oraUtils = require('./config/oracle_database');

var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

oraUtils.init();

var routes = {};
routes.users = require('./routes/api/users');

app.all('*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

//Authorization
app.post('/user/authorization', routes.users.authorization) 
//Login
app.post('/user/login', routes.users.login); 
//Logout
app.post('/user/logout', jwt({secret: secret.secretToken}), routes.users.logout);  
//modifyPwd
app.post('/user/modifyPwd', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.modifyPwd);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end('{message: '+err.message+', error: {} }');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end('{message: '+err.message+', error: {} }');
});

module.exports = app;
