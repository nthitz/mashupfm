require('dotenv').load();
var PORT = 8765;
var express = require('express')
var bodyParser = require('body-parser')
var app = express();

var db = require('./db')
var archiveRoutes = require('./archiveRoutes')
var playback = require('./playbackRoutes')

db.connect()
  .then(playback.getNextSong)

app.use(bodyParser.json({
  limit: '10mb'
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(archiveRoutes)
app.use(playback.routes)

app.get('/', function(request, result) {
  result.send('coming soon')
})


app.listen(PORT ,function() {
  console.log('listening on ' + PORT)
})


