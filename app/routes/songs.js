"use strict"
var express = require('express');
var router = express.Router();
var passport = require('passport')
var credential = require('credential')
var _ = require('lodash')
const exec = require('child_process').exec
var querystring = require('querystring')
var ffmpeg = require('fluent-ffmpeg')
var ytdl = require('youtube-dl')
var db = require('../db')
var fs = require('fs')

router.post('/uploadSong/:playlistId',
  (request, response) => {
    if (!request.user) {
      return response.status(401).json({error: 'unauthorized'})
    }
    let playlistId = request.params.playlistId
    let userId = request.user.id
    let url = request.body.url

    if (! (playlistId && userId && url) ) {
      response.status(500)
      return
    }

    url = encodeURI(url)

    var song = ytdl(url, 
      ['-f', 'bestaudio'], 
      {cwd: __dirname})

    var fileinfo = {
      _filename: 'tmp.m4a',
      ext: 'm4a'
    }

    song.on('info', function(info){
      console.log('dl started')
      console.log('filename ' + info._filename)
      console.log(info.ext)
      fileinfo = info
    })

    var tmpName = 'tmp' + Date.now()
    song.pipe(fs.createWriteStream('tmp/' + tmpName))

    //song.on('complete') <-- triggers if the video already exists, might be useful later
    song.on('end', function() {
      var extensionRegex = new RegExp(fileinfo.ext + '$')
      var filename = fileinfo._filename.replace(extensionRegex, 'm4a')
      console.log(filename + ' being added')
      ffmpeg('tmp/' + tmpName)
        .audioCodec('libfdk_aac')
        .audioQuality(2)
        .output("media/" + filename)
        .on('error', function(err, stdout, stderr){
          console.log(err)
          console.log(stderr)
          console.log(stdout)
        })
        .on('end', function(){
          console.log('transcode finished')
          response.send('finished processing')

          fs.unlink('tmp/' + tmpName)

          var format = 0
          if(url.indexOf('youtube') != -1) format = 1
          if(url.indexOf('soundcloud') != -1) format = 2

          var duration = 0
          var hms = fileinfo.duration.split(':')
          if(hms.length == 1)
            duration = parseInt(hms[0])
          if(hms.length == 2)
            duration = parseInt(60 * hms[0]) + parseInt(hms[1])
          if(hms.length == 3)
            duration = parseInt(3600 * hms[0]) + parseInt(60 * hms[1]) + parseInt(hms[2])

          var params = [
            null,
            fileinfo.display_id,
            fileinfo.thumbnails[0].url,
            fileinfo.title,
            fileinfo.uploader,
            format,
            duration,
            filename,
            'converted'
          ]

          db.query(
            'INSERT INTO "song" ("plugId", cid, image, title, author, format, duration, path, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            params
          ).then((songInsertResult) => {
            console.log(songInsertResult.rows[0].id)
            let songId = songInsertResult.rows[0].id

            db.query(
              'INSERT INTO playlist_has_song (playlist_id, song_id) VALUES ($1, $2)',
              [playlistId, songId]
            )
          })

        })
        .run()
    })
  }
)

module.exports = router;
