require('dotenv').load();
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

    var mergedPlaylists = _(results).map(function(entry) {
      // strip the extra db data we don't need
      return entry.data
    }).filter(function(data) {
      // select only playlists
      return typeof data.playlists !== 'undefined'
    }).groupBy(function(data) {
      // group playlists by their username
      return data.username
    })
      .values()
      .map(function(user) {
        //combine a users entries together
        return _(user).reduce(mergeArrayReduction)
      })
      .each(function(user) {
        user.playlists = _(user.playlists).groupBy(function(playlist) {
          return playlist.name
        }).value()//.reduce(mergeArrayReduction)
      })
      .value()
    //should modify this to just return the first playlist
    console.log(mergedPlaylists[0].playlists['admin'])
    return
    var songsFromPlaylists = _(results).groupBy(function(entry) {
      return entry.data.username
    }).map(function(entry) {
      return entry.data.playlists
    })
      .compact()
      .value()
    console.log(songsFromPlaylists)
    return
    importSongs()




    return
    console.log(results)
    var users = _(results).map(function(entry) {

      var playlistNames = _(entry.data.playlists)

      return {
        username: entry.data.username
      }
    })
      .uniq()
      .value()



    console.log(users)

    return
    // merge all songs into one array removing dupes
    if (typeof entry.data.song !== 'undefined') {

    } else if (typeof entry.data.playlists !== 'undefined') {

    }
    importUsers()
    importPlaylists()
  }
});

function mergeArrayReduction(object, current) {
  return _.merge(object, current, mergeArrays)
}

function mergeArrays(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
}

