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
    db.query('SELECT * FROM playlist WHERE id=$1 LIMIT 1', [playlistId])
      .then((playlistQueryResult) => {
        if (playlistQueryResult.rows[0].user_id !== request.user.id) {
          response.status(401).json({error: 'unauthorized'})
          return
        }
        return Promise.resolve(playlistQueryResult.rows[0])
      }).then((playlistResult) => {
        console.log(playlistResult)
        response.json(playlistResult)
      })
  }
)
module.exports = router;
