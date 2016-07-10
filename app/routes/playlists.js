"use strict"
var express = require('express');
var router = express.Router();
var passport = require('passport')
var credential = require('credential')
var _ = require('lodash')

var db = require('../db')
var playlistHelper = require('../helpers/playlistHelper')

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
        var validStatuses = ['valid', 'converted']
        return db.query(
          `SELECT song.* FROM song, playlist_has_song WHERE
            song.id = playlist_has_song.song_id AND
            playlist_has_song.playlist_id = $1 AND
            song.status IN (${
              validStatuses.map((s) => { return "'" + s + "'" }).join(',')
            })`,
          [playlistResult.id]
        )
      }).then((songs) => {
        playlist.songs = songs.rows
        response.json(playlist)
      }).catch((error) => {
        console.log(error)
        response.status(500)
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

router.post('/updatePlaylistSort/:id',
  (request, response) => {
    if (!request.user) {
      return response.status(401).json({error: 'unauthorized'})
    }
    let playlistId = request.params.id
    let userId = request.user.id
    let order = request.body.order

    if (! (playlistId && userId && order) || !_.isArray(order)) {
      response.status(500)
      return
    }

    playlistHelper.updateOrder(userId, playlistId, order)
      .error(() => {
        response.status(500)
      })
      .success(() => {
        response.send('playlist order updated')
      })
  }
)

router.post('/addSongToPlaylist/:songId/:playlistId',
  (request, response) => {
    if (!request.user) {
      return response.status(401).json({error: 'unauthorized'})
    }
    let playlistId = request.params.playlistId
    let songId = +request.params.songId
    let userId = +request.user.id
    db.query(
      'SELECT sort FROM playlist WHERE id = $1 AND user_id=$2',
      [playlistId, userId]
    ).then((result) => {
      return new Promise((resolve, reject) => {
        if (result.rows.length === 0) {
          reject('not a playlist of logged in user')
        } else {
          resolve(result.rows[0].sort)
        }
      })
    }).then((sort) => {
      if (sort.indexOf(songId) !== -1) {
        return Promise.reject('dupe')
      }
      sort.push(songId)
      let orderString = sort.map((songId) => {
        return parseInt(songId, 10)
      }).join(',')
      return db.query(
        `UPDATE playlist set sort='{${orderString}}' WHERE id=$1`,
        [playlistId]
      )
    }).then(() => {
      return db.query(
        'INSERT INTO playlist_has_song (playlist_id, song_id) VALUES ($1, $2)',
        [playlistId, songId]
      )
    }).then(() => {
      response.json({status: 'ok'})
    }).catch((error) => {
      if (error === 'dupe') {
        return response.json({status: 'already in playlist'})
      }
      console.log(error)
      response.status(500)
    })

  })

router.post('/removeSongFromPlaylist/:songId/:playlistId',
  (request, response) => {
    if (!request.user) {
      return response.status(401).json({error: 'unauthorized'})
    }
    let playlistId = request.params.playlistId
    let songId = request.params.songId
    let userId = +request.user.id
    db.query(
      'SELECT sort FROM playlist WHERE id = $1 AND user_id=$2',
      [playlistId, userId]
    ).then((result) => {
      return new Promise((resolve, reject) => {
        if (result.rows.length === 0) {
          reject('not a playlist of logged in user')
        } else {
          resolve(result.rows[0].sort)
        }
      })
    }).then((sort) => {
      let songIndex = sort.indexOf(songId)
      if (songIndex !== -1) {
        return Promise.reject('not in playlist')
      }
      sort.splice(songIndex, 1)
      let orderString = sort.map((songId) => {
        return parseInt(songId, 10)
      }).join(',')
      return db.query(
        `UPDATE playlist set sort='{${orderString}}' WHERE id=$1`,
        [playlistId]
      )
    }).then(() => {
      return db.query(
        'DELETE FROM playlist_has_song WHERE playlist_id=$1 AND song_id=$2',
        [playlistId, songId]
      )
    }).then(() => {
      response.json({status: 'ok'})
    }).catch((error) => {
      console.log(error)
      response.status(500)
    })

  })


module.exports = router;
