require('dotenv').config({path: '../.env'})
var pg = require('pg')
var _ = require ('lodash')

pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
  if (err) {
    console.error(err)
    result.send('db connection error')
    done()
    return
  }
  var query = client.query('SELECT * FROM  "Entry"')
  var results = []
  query.on('row', function(row) {
    results.push(row);
  });

  // After all data is returned, close connection and return results
  query.on('end', function() {
    insertResults(results)
  })

  function insertResults(results) {

    var entriesByUser = _(results).map(function(entry) {
      // strip the extra db data we don't need
      return entry.data
    }).filter(function(data) {
      // select only playlists
      return typeof data.playlists !== 'undefined'
    }).groupBy(function(data) {
      // group playlists by their username
      return data.username
    }).value()

    var users = Object.keys(entriesByUser);
    var lastUserEntry = _(users)
        .map(function(user) {
          var lastUserEntryIndex = entriesByUser[user].length - 1
          return entriesByUser[user][lastUserEntryIndex]
        }).value()

    // we now have the last entry that each user submitted. that's a good thing

    var songs = _(lastUserEntry)
      .map(function(entry) {
        // get just the playlists
        return entry.playlists
      })
      .flatten() //merge arrays
      .map(function(playlist) {
        // get just the songs
        return playlist.songs.data
      })
      .flatten() //merge arrays
      .uniq() //remove dupes
      .value()

    insertSongs(songs)
    done()
    console.log('done');
    process.exit(0)
  }
  function insertSongs(songs) {
    var numInserted = 0
    insertSong();
    function insertSong() {
      var nextSong = songs[numInserted];
      var params = [
        nextSong['plugId'],
        nextSong['image'],
        nextSong['title'],
        nextSong['author'],
        nextSong['format'],
        nextSong['duration'],
      ];
      client.query(
        'INSERT INTO "Song" (plugId, image, title, author, format, duration) VALUES ($1, $2, $3, $4, $5, $6)',
        params,
        function(err) {
          if(err) {
            console.log('error');
            console.log(err)
            return;
          }
          numInserted++
          if (numInserted === songs.length) {
            insertFinished()
          } else {
            insertSong
          }
        }
      )
    }
    function insertFinished() {
      console.log('insert finished')
      // should do something with a promise here.
    }
  }
});
