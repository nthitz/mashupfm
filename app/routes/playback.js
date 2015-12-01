'use strict'
var express = require('express');
var router = express.Router();
var _ = require('lodash')

var db = require('../db')
var ServerActions = require('../ServerActions')

var currentSong = null;
var currentDJ = null
var djIntendsToStay = true

var songStartedAt = -1
var userIDs = [1];
var nextSongTimeout = null

let queue = [];
var socket = null

function setSocket(_socket) {
  socket = _socket
}
function getDefaultSong() {
  // console.log('get default song')
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
  // console.log('get next song')
  let onNewSong = (song) => {
    console.log(song)
    songStartedAt = Date.now()
    clearTimeout(nextSongTimeout)
    nextSongTimeout = setTimeout(getNextSong, song.duration * 1000)
    currentSong = song
    return currentSong
  }

  if (currentDJ && djIntendsToStay) {
    queue.push(currentDJ)
  }
  currentDJ = queue.shift()
  var maxTries = 100;
  while (currentDJ && !socket.isUserOnline(currentDJ.id)) {
    currentDJ = queue.shift()
    if (maxTries-- < 0) { break }
  }

  ServerActions.queueChanged(queue)

  djIntendsToStay = true

  if (!currentDJ) {
    return getDefaultSong()
      .then(onNewSong)
  }

  // console.log('get user song', currentDJ)
  return db.query(
    `SELECT playlist.sort, "user".active_playlist_id, song.*
      FROM "user", playlist, song
      WHERE "user".id=$1 AND
        playlist.id="user".active_playlist_id AND
        song.id=playlist.sort[1]
    `,
    [currentDJ.id]
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
    ServerActions.forceRefreshPlaylist(currentDJ.id)

    return nextSong
  }).then(onNewSong)
  .catch((error) => {
    console.log(error)
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
    dj: currentDJ,
    seek: seek,
  })
})

router.get('/joinQueue', function(request, response) {
  if (!request.user) {
    response.status(500).send('nope')
  }


  // bail if user is currentDJ
  // if user is current dj
  if (currentDJ && request.user.id === currentDJ.id) {
    if (!djIntendsToStay) {
      djIntendsToStay = true
      return response.json({
        status: 'success',
        currentQueue: queue,
      })
    }
    return response.json({
      status: 'error',
      error: 'joining a queue and already playing'
    })

  }

  // bail if user in queue
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
  ServerActions.queueChanged(queue)

  response.json({
    status: 'success',
    currentQueue: queue,
  })
})

// somehow need to remove users based on a timeout
router.get('/leaveQueue', function(request, response) {
  if (!request.user) {
    response.status(500).send('nope')
  }
  // console.log('user leaving queue %s', request.user.username)

  if (currentDJ && request.user.id === currentDJ.id) {
    djIntendsToStay = false
    // console.log('user is dj marking intendsToStay=false')
    return response.json({ 'status': 'success' })
  }

  let queueIndex = _.findIndex(queue, (user) => {
    return user.id === request.user.id
  })
  if (queueIndex === -1) {
    // console.log('user is not in queue')
    return response.json({error: 'not in queue'})
  }


  // console.log('splicing', queueIndex)
  queue.splice(queueIndex, 1)
  ServerActions.queueChanged(queue)

  // console.log('new queue length ', queue.length)

  response.json({status: 'success'})
})

router.get('/currentQueue', function(request, response) {
  response.json(queue)
})

function getQueue() {
  return queue
}

ServerActions.forceSkip.listen(skip)

module.exports = {
  routes: router,
  getNextSong: getNextSong,
  getQueue: getQueue,
  setSocket: setSocket,
};