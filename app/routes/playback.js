'use strict'
var express = require('express');
var router = express.Router();

var db = require('../db')
var ServerActions = require('../ServerActions')

var currentSong = null;
var songStartedAt = -1
var userIDs = [1];
var nextSongTimeout = null

function getNextSong() {
  return db.query('SELECT * FROM "playlist" WHERE user_id IN (' + userIDs.join(',') + ')')
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
      var validStatuses = ['valid', 'converted']
      if (validStatuses.indexOf(song.status) === -1) {
        process.nextTick(getNextSong)
        return
      }
      currentSong = song;
      console.log(currentSong)
      songStartedAt = Date.now()
      clearTimeout(nextSongTimeout)
      nextSongTimeout = setTimeout(getNextSong, song.duration * 1000)
      return currentSong
    })
}

function skip() {
  clearTimeout(nextSongTimeout)
  getNextSong()
    .then((song) => {
      ServerActions.forceClientNewSong()
    })
}
router.get('/currentSong', function(request, result) {
  let seek = 0
  if (request.query.seek) {
    seek = Date.now() - songStartedAt
  }
  result.json({
    song: currentSong,
    seek: seek,
  })
})

ServerActions.forceSkip.listen(skip)

module.exports = {
  routes: router,
  getNextSong: getNextSong,
};