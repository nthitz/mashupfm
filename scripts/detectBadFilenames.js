"use strict"

require('dotenv').config({path: '../.env'})
var db = require('../app/db')
var fs = require('fs')
var _ = require ('lodash')

var PATH = '../media/';

var BAD_FILENAME_ERROR_CODE = 'ENOENT'

db.connect().then((client) => {
  var typesToScan = ['valid', 'converted', 'valid-badfilename', 'converted-badfilename']
  var processSong;
  var songs = []
  db.query(
    `SELECT path, id, status FROM "song" WHERE status IN (${
      typesToScan.map((s) => { return "'" + s + "'" }).join(',')
    })`
  ).then((result) => {
    songs = result.rows
    processSong()
  }).catch((error) => {
    console.log(error)
  })
  processSong = () => {
    var song = songs.shift()
    console.log(song.path)
    fs.open(PATH + song.path, 'r', (error, fd) => {
      if (error) {
        if (error.code === BAD_FILENAME_ERROR_CODE) {
          let newStatus = song.status.replace(/-badfilename/g,'') + '-badfilename'
          db.query(
            'UPDATE "song" SET status=$1 WHERE id=$2',
            [newStatus, song.id]
          ).then(next)
        } else {
          throw error
        }
      } else {
        fs.close(fd,() => {
          next()
        })
      }
    })

    var next = () => {
      if (songs.length > 1) {
        process.nextTick(processSong)
      } else {
        console.log('done')
      }
    }
  }

}).catch((error) => {
  console.log(error)
})