"use strict"

require('dotenv').config({path: '../.env'})
var db = require('../app/db')
var fs = require('fs')
var _ = require ('lodash')

var PATH = '../media/';

var BAD_FILENAME_ERROR_CODE = 'ENOENT'

db.connect().then((client) => {
 db.query('SELECT playlist.id FROM playlist')
  .then((result) => {
    _.each(result.rows, (playlist) => {
      console.log(playlist)
      let count = + playlist.count;
      var sort = _.range(count).join(',')
      db.query(
        'SELECT song_id FROM playlist_has_song WHERE playlist_id=$1',
        [playlist.id]
      ).then((songResult) => {
        let songIds = songResult.rows.map(_.property('song_id')).join(',')
        // console.log(songIds)
        db.query(
          `UPDATE playlist SET sort='{${songIds}}' WHERE id=$1`,
          [playlist.id]
        ).then((result) => {
          console.log('update playlist ' + playlist.id)
        })
      }).catch((error) => {
        console.log(error)
      })
    })
  })
}).catch((error) => {
  console.log(error)
})