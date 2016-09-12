var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/login')
.get(function(req, res) {
	res.render('login', { title: 'Login' });
})
.post(function(req, res) {
	var user = {
		name: 'admin',
		password: '123456' 
	}
	if(req.body.username == user.name && req.body.password == user.password) {
		req.session.user = user;
		res.redirect('/home');
	} else {
		req.session.error='用户名或密码不正确';
		res.redirect('/login');
	}
});

router.route('/logout')
.get(function(req, res) {
	req.session.user = null;
	res.redirect('/');
});

router.route('/home')
.get(function(req, res) {
	var user = {
		name: 'admin',
		password: '123456'
	}
	authentication(req, res);
	res.render('home',{title: 'home', user: user});
});

function authentication(req, res) {
    if (!req.session.user) {
    	req.session.error='请先登录';
        return res.redirect('/login');
    }
}

module.exports = router;
