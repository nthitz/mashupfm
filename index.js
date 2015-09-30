require('dotenv').load();
var PORT = 8765;
var express = require('express')
var pg = require('pg')
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json({
  limit: '10mb'
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/archive', function(request, result) {
  pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
    if (err) {
      console.error(err)
      result.send('db connection error')
      done()
      return
    }
    client.query('INSERT INTO "Entry" (data) VALUES ($1)', [JSON.stringify(request.body)], function(err, dbresult) {
      if (err) {
        console.error(err)
        result.send('db error')
        done()
        return
      }
      done()
      result.send('success')
    })
  })
})

app.get('/', function(request, result) {
  result.send('coming soon')
})
app.get('/archive', function(request, result) {
  result.send(
    "<script src='https://code.jquery.com/jquery-2.1.4.min.js'></script>" +
    "<div>" +
    "  Paste your JSON below: (it might take a 10-20 seconds to paste the json if it is large, please be patient)<br />" +
    "  <textarea id='scraped_status' rows='20' cols='50'></textarea>" +
    "  <button id='submitButton' value='submit'>submit</button>" +
    "</div>" +
    "<script>" +
    "  $(function() {" +
    "    $('#submitButton').click(function() {" +
    "      var json = $('#scraped_status').val();" +
    "      if (json === '') { return; };" +
    "      var POST_URL = '/archive';" +
    "      $.ajax(POST_URL, {" +
    "        method: 'POST'," +
    "        data: json," +
    "        contentType: 'application/json'," +
    "        complete: function(xhr, status) {" +
    // "          $('#scraped_status').val('');" +
    "          alert(status);" +
    "        }," +
    "        error: function(xhr, statuss, err) {" +
    "          alert(status + ' ' + err)" +
    "        }" +
    "      });" +
    "    });" +
    "  });" +
    "</script>"
  )
})

app.get('/list/:username', function(request, result) {
  pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
    if (err) {
      console.error(err)
      result.send('db connection error')
      done()
      return
    }
    var usernameQuery = JSON.stringify({username: request.params.username});
    var query = client.query('SELECT * FROM  "Entry" WHERE data @> $1', [usernameQuery])
    var results = []
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        done()
        result.json(results);
    });

  })
})

app.listen(PORT ,function() {
  console.log('listening on ' + PORT)
})

