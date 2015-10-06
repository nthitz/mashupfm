require('dotenv').config({path: '../.env'})
var pg = require('pg')
var _ = require ('lodash')

pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
  if (err) {
    console.error(err)
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

  var songLookup = {}
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

    var users = _(Object.keys(entriesByUser))
      .map(function(user) {
        return {username: user}
      }).value();
    var lastUserEntries = _(users)
        .map(function(user) {
          var lastUserEntryIndex = entriesByUser[user.username].length - 1
          var lastEntry = entriesByUser[user.username][lastUserEntryIndex]
          lastEntry.user = user;
          return lastEntry
        }).value()


    // we now have the last entry that each user submitted. that's a good thing

    var songs = _(lastUserEntries)
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
      .uniq('cid') //remove dupes
      .value()

    deleteStuff()
      .then(function() {
        return insertSongs(songs)
      })
      .then(function() {
        return insertUsers(users)
      })
      .then(function() {
        return insertPlaylists(lastUserEntries)
      }).then(function() {
        done()
        console.log('done');
        process.exit(0)
      }, function() {
        console.log('error');
        console.log(arguments)
      })
  }

  function deleteStuff() {
    return new Promise(function(resolve, reject) {
      deletePlaylists()
      function deletePlaylists() {
        console.log('resetting playlists')
        client.query('DELETE FROM "playlist_has_song"', function() {
          client.query('DELETE FROM "playlist"', function() {
            client.query('ALTER SEQUENCE "playlist_id_seq" RESTART WITH 1', deleteUsers)
          })
        })
      }
      function deleteUsers() {
        console.log('resetting users')
        client.query('DELETE FROM "user"', function() {
          client.query('ALTER SEQUENCE user_id_seq RESTART WITH 1', deleteSongs)
        })
      }
      function deleteSongs() {
        console.log('resetting songs')
        client.query('DELETE FROM "song"', function() {
          client.query('ALTER SEQUENCE song_id_seq RESTART WITH 1', function() {
            resolve()
          })
        })
      }
    });
  }
  function insertPlaylists(entries) {
    return new Promise(function(resolve, reject) {
      var numEntriesInserted = 0;
      insertEntry()
      function insertEntry() {
        var nextEntry = entries[numEntriesInserted];
        console.log('nextEntry')
        Promise.all(_.map(nextEntry.playlists, function(playlist) {
          return new Promise(function(playlistResolve, playlistReject) {
            //insert playlist get ID
            client.query({
              text: 'INSERT INTO "playlist" (name, user_id) VALUES ($1, $2) RETURNING id',
              values: [playlist.name, nextEntry.user.id],
              callback: function (error, result) {
                if (error) {
                  console.log('error');
                  console.log(error)
                  reject()
                  return
                }
                playlist.id = result.rows[0].id
                console.log(playlist.name)
                Promise.all(_.map(playlist.songs.data, function(song) {
                  // console.log(song)
                  return new Promise(function(songResolve, songReject) {
                    client.query({
                      text: 'INSERT INTO "playlist_has_song" (playlist_id, song_id) VALUES ($1, $2)',
                      values: [playlist.id, songLookup[song.cid]],
                      callback: function(error, result) {
                        if (error) {
                          console.log('error');
                          console.log(error);
                          songReject();
                          return
                        }
                        songResolve()
                      }
                    })
                  })
                }))
                .then(function() {
                  playlistResolve()
                })
              }
            })
          })
        })).then(function() {
          numEntriesInserted++;
          if (numEntriesInserted === entries.length) {
            resolve()
          } else {
            insertEntry()
          }
        })
      }
    })
    // hmm I'm sorry about this ^^^^
  }

  function insertUsers(users) {
    console.log('insert users')
    return new Promise(function(resolve, reject) {
      var numInserted = 0;
      insertUser()
      function insertUser() {
        console.log('inserting user ' + numInserted);
        var nextUser = users[numInserted]
        client.query({
          text: 'INSERT INTO "user" (username) VALUES ($1) RETURNING id',
          values: [nextUser.username],
          callback: function(error, result) {
            if (error) {
              console.log('error');
              console.log(error);
              reject(error);
              return
            }
            nextUser['id'] = result.rows[0].id
            numInserted++;
            if (numInserted === users.length) {
              console.log('users inserted');
              resolve()
            } else {
              insertUser()
            }
          }
        })
      }
    })
  }
  function insertSongs(songs) {
    console.log('insert songs')
    return new Promise(function(resolve, reject) {
      var numInserted = 0
      insertSong()
      function insertSong() {
        console.log('inserting song ' + numInserted)
        var nextSong = songs[numInserted];
        var params = [
          nextSong['id'],
          nextSong['image'],
          nextSong['title'],
          nextSong['author'],
          nextSong['format'],
          nextSong['duration'],
        ];
        nextSong['plugId'] = nextSong['id'];
        var a = client.query({
          text: 'INSERT INTO "song" ("plugId", image, title, author, format, duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          values: params,
          callback: function(err, result) {
            if(err) {
              console.log('error');
              console.log(err)
              reject(err)
              return;
            }
            songLookup[nextSong['cid']] = result.rows[0]['id']
            numInserted++
            if (numInserted === songs.length) {
              insertFinished()
            } else {
              insertSong()
            }
          }
        })
      }
      function insertFinished() {
        console.log('songs finished')
        resolve(true)
      }
    })
  }
});
