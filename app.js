var express = require('express');
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session=require('express-session');
//var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('./models/dbUtils');
require('dotenv').config();
var app = express();
app.use(morgan('tiny'));
var socket_io = require( "socket.io" );
// Socket.io
var io = socket_io();
app.io = io;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true
}));
// socket connection


pg.connectToServer(function () {
    var socketController = require('./controllers/socketController')(io);



    var gameModel=require('./models/gameData');
    gameModel.configs(function(response){
       console.log(response);
    });

    var redisController=require('./controllers/redisController');
    redisController.serverConnect();
    var tableController=require('./controllers/tableController');
    tableController.clearEmptyTables(function(idTable){
        io.sockets.emit('deleteTable',idTable);
    });
    var index = require('./routes/index');
    var user = require('./routes/user');
    var login = require('./routes/login');
    var games = require('./routes/games');
    var tictactou = require('./routes/tictactou');
    var room = require('./routes/room');
    var logout=require('./routes/logout');
    var cms = require('./routes/cms');
    var addGame=require('./routes/addGame');
    //tmp
    var game = require('./routes/gameTemplate');
    app.use('/game', game);
    app.use('/addGame',addGame);
    app.use('/', index);
    app.use('/index',index);
    app.use('/user', user);
    app.use('/login', login);
    app.use('/games', games);
    app.use('/tictactou', tictactou);
    app.use('/room',room);
    app.use('/logout',logout);
    app.use('/cms',cms);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.locals.session = req.session;
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    const redisConfig = require('./modules/redisConfig');
});
module.exports.io=io;
module.exports = app;
