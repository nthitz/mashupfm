"use strict"

require('dotenv').config({path: '../.env'})
var db = require('../app/db')
var fs = require('fs')
var _ = require ('lodash')

var PATH = '../media/';

var BAD_FILENAME_ERROR_CODE = 'ENOENT'

db.connect().then((client) => {
 db.query('SELECT playlist.id FROM playlist WHERE sort IS NULL')
  .then((result) => {
    _.each(result.rows, (playlist) => {
      let count = + playlist.count;
      var sort = _.range(count).join(',')
      db.query(
        'SELECT song_id FROM playlist_has_song WHERE playlist_id=$1',
        [playlist.id]
      ).then((songResult) => {
        return Promise.all(songResult.rows.map((songId) => {
          return db.query(
            'SELECT status, id FROM song WHERE id=$1',
            [songId.song_id]
          )
        })).then((songResults) => {
          return _.filter(
            _.map(songResults, (songResult) => {
              return songResult.rows[0]
            }),
            (song) => {
              var validStatuses = ['valid', 'converted']
              return validStatuses.indexOf(song.status) !== -1
            }
          )
        })
      }).then((ids) => {
        let songIds = ids.map(_.property('id')).join(',')
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