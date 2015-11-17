'use strict'
var express = require('express');
var router = express.Router();
var _ = require('lodash')

var db = require('../db')
var ServerActions = require('../ServerActions')

var currentSong = null;
var songStartedAt = -1
var userIDs = [1];
var nextSongTimeout = null

let queue = [];
let currentPlayingUser = null


function getDefaultSong() {
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
      return song
    })
}

function getNextSong() {
  let onNewSong = (song) => {
    console.log(song)
    songStartedAt = Date.now()
    clearTimeout(nextSongTimeout)
    nextSongTimeout = setTimeout(getNextSong, song.duration * 1000)
    currentSong = song
    return currentSong
  }
  // if no one playlist just pick a default song and be done
  if (queue.length === 0 && currentPlayingUser === null) {
    return getDefaultSong()
      .then(onNewSong)
  }

  if (currentPlayingUser !== null) {
    queue.push(currentPlayingUser)
  }
  currentPlayingUser = queue.shift()
  return db.query(
    `SELECT playlist.sort, "user".active_playlist_id, song.*
      FROM "user", playlist, song
      WHERE "user".id=$1 AND
        playlist.id="user".active_playlist_id AND
        song.id=playlist.sort[1]
    `,
    [currentPlayingUser.id]
  ).then((result) => {
    let nextSong = result.rows[0]
    let sort = nextSong.sort
    let playlistId = nextSong.active_playlist_id

    delete nextSong.sort
    delete nextSong.active_playlist_id

    // move the played song to the back of the playlist order
    sort.push(sort.shift())

    // push to db
    let sortIds = sort.join(',')
    db.query(
      `UPDATE playlist SET sort='{${sortIds}}' WHERE id=$1`,
      [playlistId]
    )

    // push to user
    ServerActions.forceRefreshPlaylist(currentPlayingUser.id)

    return nextSong
  }).then(onNewSong)



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

router.get('/joinQueue', function(request, response) {
  if (!request.user) {
    response.status(500).send('nope')
  }
  let inQueue = _.find(queue, (user) => {
    return user.id === request.user.id
  })

  if (inQueue) {
    return response.json({error: 'already in queue'})
  }

  queue.push({
    username: request.user.username,
    id: request.user.id,
  })
  response.json({
    status: 'success',
    currentQueue: queue,
  })
})

router.get('/leaveQueue', function(request, response) {
  if (!request.user) {
    response.status(500).send('nope')
  }
  let queueIndex = _.findIndex(queue, (user) => {
    return user.id === request.user.id
  })

  if (queueIndex === -1) {
    return response.json({error: 'not in queue'})
  }

  queue.splice(queueIndex, 1)

  if (queue.length === 0) {
    currentPlayingUser = null
  }
  response.json({status: 'success'})
})

router.get('/currentQueue', function(request, response) {
  response.json(queue)
})

ServerActions.forceSkip.listen(skip)

module.exports = {
  routes: router,
  getNextSong: getNextSong,
};