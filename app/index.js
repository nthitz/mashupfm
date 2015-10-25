require('dotenv').load();

var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var passport = require('passport')
var pgSession = require('connect-pg-simple')(session)

var webpack = require('webpack')
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require('../webpack.config')

var db = require('./db')
var auth = require('./auth')
var routes = require('./routes')

var playback = require('./routes/playback')
var chat = require('./routes/chat')

var app = express();

var isProduction = process.env.NODE_ENV === 'production'
var PORT = 8765;

if (isProduction) {
  PORT = 8567
}

db.connect()
  .then(initApp)

function initApp() {
  playback.getNextSong()

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json({
    limit: '10mb'
  }));
  app.use(session({
    secret: process.env.COOKIE_SECRET,
    store: new pgSession({
      conString: process.env.PG_CONNECTION,
    }),
    resave: false,
    saveUninitialized: true,
  }))
  app.use(passport.initialize());
  app.use(passport.session());

  chat.useChatWebsocket(app)

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(routes)

  if (!isProduction) {
    app.use(webpackMiddleware(webpack(webpackConfig)))
  }

  app.use('/media', express.static('media'))
  app.use(express.static('dist'))
  app.use('/assets',express.static('app/assets'))

  app.listen(PORT ,function() {
    console.log('listening on ' + PORT)
  })

}

