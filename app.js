
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ejs = require('ejs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);
app.use(express.cookieParser());
app.use(express.session({
  key    : 'sid',
  secret : 'secret'
}));
ejs.open = '<?';
	ejs.close = '?>';
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));




require('./oauth')(app);
app.get('/', function(req, res) {
  //
  // 세션정보를 확인한다.
  //
  //console.log(req.session);
  //
  // req.user 는 아래에서 설명한다.
  // 처음에 undefined 이나, 로그인 성공하면, profile 정보가 저장된다.
  //
  //console.dir(req.passport);
  console.log('login Info : ' );
  console.dir(req.session.passport);
  res.render('index.html');
});
//app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
