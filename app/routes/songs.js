"use strict"
var express = require('express');
var router = express.Router();
var passport = require('passport')
var credential = require('credential')
var _ = require('lodash')
const exec = require('child_process').exec
var querystring = require('querystring')
var ffmpeg = require('ffmpeg')
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
    console.log(playlistId)
    console.log(userId)

    if (! (playlistId && userId && url) ) {
      response.status(500)
      return
    }

    //maybe secure?
    url = encodeURI(url)
    console.log(url)

    var song = ytdl(url, 
      ['-f', 'bestaudio'], 
      {cwd: __dirname})

    song.on('info', function(info){
      console.log('dl started')
      console.log('filename ' + info._filename)
      console.log('size ' + info.size)
    })

    song.pipe(fs.createWriteStream('test.m4a'))

    //song.on('complete') <-- triggers if the video already exists
    song.on('end', function() {
      console.log('finsihedddd!!!')
      try {
        var process = new ffmpeg('/home/j/projects/mashupfm/test.m4a')
        process.then(function(audio) {
          audio
            .addCommand('-acodec', 'libfdk_aac')
            .addCommand('-vbr', '2')
            .save('test2.m4a', function(error, file) {
              if(!error)
                console.log('audio transcoded: ' + file)
              else
                console.log(error)
            })
        })
      } catch (e) {
        console.log('ffmpeg error')
      }
    })
    /*
    //this is gonnnnnnna be sooooo insecure
    exec('./scripts/downloadSong.sh ' + url, (err, stdout, stderr) => {
      if(err){
        console.error(`exer error: ${err}`)

        //we could probably regex it to see if it's invalid, but lets let youtube-dl decide because i'm lazy
        if(err.toString().indexOf('valid URL') != -1)
          response.send('invalid url')
        else
          response.send('error')
        return
      }

      console.log(`stdout: ${stdout}`)
      response.json(JSON.parse(stdout))
      response.status(300)
      
    })
    */
  }
)

module.exports = router;
