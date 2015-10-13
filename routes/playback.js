var express = require('express');
var router = express.Router();

var db = require('../db')

var curSong = null;

var userIDs = [1];

function getNextSong() {
  console.log('getNextSong')
  db.query('SELECT * FROM "playlist" WHERE user_id IN (' + userIDs.join(',') + ')')
    .then(function(result) {
      return result.rows.reduce(function(prev, next) {
        prev.push(next.id)
        return prev;
      }, [])

    }).catch(function(error) {
      console.log(error)
    })
    .then(function(ids) {
      return db.query('SELECT song_id FROM playlist_has_song WHERE playlist_id IN (' + ids.join(',') + ')')
    })
    .then(function(result) {
      return result.rows
    })
    .then(function(songIds) {
      return songIds[Math.floor(Math.random() * songIds.length)].song_id
    }).then(function(songId) {
      return db.query('SELECT * FROM "song" WHERE id=$1', [songId])
    }).then(function(result) {
      var song = result.rows[0]
      if (song.status !== 'valid') {
        process.nextTick(getNextSong)
        return
      }
      curSong = song;
      console.log(curSong)
      setTimeout(getNextSong, song.duration * 1000)
    })
}

router.get('/currentSong', function(request, result) {
  result.json(curSong)
})

module.exports = {
  routes: router,
  getNextSong: getNextSong,
};