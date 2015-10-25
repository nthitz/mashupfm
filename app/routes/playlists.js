"use strict"
var express = require('express');
var router = express.Router();
var passport = require('passport')
var credential = require('credential')

var db = require('../db')

router.get(
  '/getUserPlaylists',
  function(request, response) {
    if (!request.user) {
      response.status(401).json({error: 'unauthorized'})
      return
    }
    db.query('SELECT * FROM playlist WHERE user_id=$1', [request.user.id])
      .then((result) => {
        response.json(result.rows)
      })
  }
)

router.get('/getPlaylist/:playlistId',
  (request, response) => {
    if (!request.user) {
      response.status(401).json({error: 'unauthorized'})
      return
    }
    let playlistId = request.params.playlistId
    let playlist = null;
    db.query('SELECT * FROM playlist WHERE id=$1 LIMIT 1', [playlistId])
      .then((playlistQueryResult) => {
        if (playlistQueryResult.rows[0].user_id !== request.user.id) {
          response.status(401).json({error: 'unauthorized'})
          return
        }
        return Promise.resolve(playlistQueryResult.rows[0])
      }).then((playlistResult) => {
        playlist = playlistResult
        return db.query(
          `SELECT song.* FROM song, playlist_has_song WHERE
            song.id = playlist_has_song.song_id AND
            playlist_has_song.playlist_id = $1`,
          [playlistResult.id]
        )
      }).then((songs) => {
        playlist.songs = songs.rows
        response.json(playlist)
      }).catch((error) => {
        console.log(error)
      })

  }
)
module.exports = router;
