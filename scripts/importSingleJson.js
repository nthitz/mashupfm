"use strict"

require('dotenv').config({path: '../.env'})
var db = require('../app/db')
var fs = require('fs')
var _ = require ('lodash')

db.connect().then((client) => {
  var path = process.argv[2]
  var data = JSON.parse(fs.readFileSync(path))
  // console.log(data)
  var songLookup = {}

  //get user id from username
  let userId = null;
  db.query('SELECT id FROM "user" WHERE username=$1', [data.username])
    .then((result) => {
      if (result.rows.length < 1) {
        throw new Error(
          'couldn\'t find user with that username ' + data.username
        )
      }
      userId = result.rows[0].id
      return userId
    })
    //insert playlists and get insert id
    .then((id) => {
      return Promise.all(
        _.map(data.playlists, (playlist) => {
          return new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO playlist (name, user_id) VALUES ($1, $2) RETURNING id',
              [playlist.name, userId]
            ).then((playlistResult) => {
              playlist.id = playlistResult.rows[0].id
              resolve(playlist)
            })
          })
        })
      )
    }).then((playlists) => {
      insertSongs(playlists, userId)
    }).catch((error) => {
      console.log('problem')
      console.log(error)
    })

    function insertSongs(playlists, userId) {
      _.each(playlists, (playlist) => {
        _.each(playlist.songs.data, (song) => {
          console.log(song)
          db.query(
            'SELECT id FROM song WHERE cid=$1',
            [song.cid]
          ).then((songIdResult) => {
            if (songIdResult.rows.length > 0) {
              return Promise.resolve(songIdResult.rows[0].id)
            }
            var params = [
              song.id,
              song.cid,
              song.image,
              song.title ? song.title : '',
              song.author,
              song.format,
              song.duration,
            ];
            song.plugId = song.id;
            return new Promise((resolve, reject) => {
              db.query(
                'INSERT INTO "song" ("plugId", cid, image, title, author, format, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                params
              ).then((songInsertResult) => {
                resolve(songInsertResult.rows[0].id)
              })
            })
          }).then((songId) => {
            song.id = songId
            db.query(
              'INSERT INTO playlist_has_song (playlist_id, song_id) VALUES ($1, $2)',
              [playlist.id, songId]
            ).then((insert) => {
              console.log('inserted into playlist_has_song', playlist.id, songId)
            })
          })
        })
      })
    }

}).catch((error) => {
  console.log(error)
})