//module.exports = init;
exports.init = function(app) {
	var mysql = require('mysql');
	var connection = null;
	var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
	
	

	passport.serializeUser(function(user, done) {
		console.log('serial');
		console.dir(user[0]);
		
		user[0].userId = user[0].id;
		
		delete user[0].idx;
		delete user[0].password;
		delete user[0].id;
		
		done(null, user);
	});
	
	passport.deserializeUser(function(userId, done) {
		connection.query('SELECT * FROM user_info WHERE id = ?', [userId], function(err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy( {
		usernameField: 'userId'
	}, function(userId, password, done) {
		console.log('local strategy called');
		connection.query('SELECT * FROM user_info WHERE id = ? AND password = ?', [userId, password], function(err, results) {
			console.log(results);
			if (results.length == 0) {
				return done(null, false, false);
			} else {
				return done(null, results);
			}
		});
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	// development only
	//Connect to MYSQL database local database - DEV
	connection = mysql.createConnection({
		host : 'enterkey.kr',
		user : 'frontfloor',
		password : 'frontfloor1',
		database : 'mr_pres',
		port : '3306'
	});

	connection.connect(function(err) {
		// connected! (unless `err` is set)
		if (!err) {
			console.log('database connected');
		} else {
			console.log(err.code);
			// 'ECONNREFUSED'
			console.log(err.fatal);
			// true
		}

	});

	app.post('/login', passport.authenticate('local', {
		successRedirect : '/',
		failureRedirect : '/'
	}));
}

