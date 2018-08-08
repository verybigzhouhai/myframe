var createError = require('http-errors');
var express = require('express');


var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');
//var uploadRouter = require('./routes/upload');

var app = express();

app.use(bodyParser.json());
//app.use(bodyParser({ uploadDir: './uploads' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'hnkwcplnhvgfbnd', //secret的值建议使用随机字符串
    cookie: { maxAge: 60 * 1000 * 15 } // 过期时间（毫秒）
}));

//app.use(express.static('public'))
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));
// app.use(function(req, res, next) {
//     req.session._garbage = Date();
//     req.session.touch();
//     next();
// });

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    //res.header("Access-Control-Allow-Origin", "http://139.196.22.22:8080");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);
//app.use('/uploads', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;