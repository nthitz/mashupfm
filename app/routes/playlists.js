"use strict"
var express = require('express');
var router = express.Router();
var passport = require('passport')
var credential = require('credential')
var _ = require('lodash')

var db = require('../db')

router.get(
  '/getUserPlaylists',
  function(request, response) {
    if (!request.user) {
      response.status(401).json({error: 'unauthorized'})
      return
    }
    db.query('SELECT active_playlist_id FROM "user" WHERE id = $1', [request.user.id])
      .then((activePlaylistResult) => {
        return activePlaylistResult.rows[0].active_playlist_id
      })
      .then((activePlaylistId) => {
        db.query('SELECT * FROM playlist WHERE user_id=$1', [request.user.id])
          .then((result) => {
            let activePlaylist = _.find(
              result.rows,
              (playlist) => { return playlist.id === activePlaylistId }
            );
            if (activePlaylist) {
              activePlaylist.active = true
            }
            response.json(result.rows)
          })
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

router.get('/setActivePlaylist/:id',
  (request, response) => {
    if (!request.user) {
      return response.status(401).json({error: 'unauthorized'})
    }
    let playlistId = request.params.id
    let userId = request.user.id
    db.query(
      'SELECT COUNT(*) AS count FROM playlist WHERE id = $1 AND user_id=$2',
      [playlistId, userId]
    ).then((result) => {
      return new Promise((resolve, reject) => {
        if (result.rows[0].count == 1) { //count returns as a string so `==`
          resolve()
        }
        reject('not a playlist of logged in user')
      })
    }).then(() => {
      return db.query(
        'UPDATE "user" SET active_playlist_id = $1 WHERE id = $2',
        [playlistId, userId]
      )
    }).then((result) => {
      return response.send(JSON.stringify({status: 'success' }))
    }).catch((error) => {
      console.log(error)
      response.status(500)
    })
  }
)

module.exports = router;
