require('dotenv').load();
var PORT = 8765;
var express = require('express')
var pg = require('pg')
var bodyParser = require('body-parser')
var app = express();

var archiveRoutes = require('./archiveRoutes')
app.use(bodyParser.json({
  limit: '10mb'
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(archiveRoutes)

app.get('/', function(request, result) {
  result.send('coming soon')
})


app.listen(PORT ,function() {
  console.log('listening on ' + PORT)
})

