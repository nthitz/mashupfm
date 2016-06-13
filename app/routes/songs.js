"use strict"
var express = require('express');
var router = express.Router();
var passport = require('passport')
var credential = require('credential')
var _ = require('lodash')
const exec = require('child_process').exec
var querystring = require('querystring')

var db = require('../db')

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

    url = querystring.escape(url)
    console.log(url)

    //this is gonnnnnnna be sooooo insecure
    exec('./scripts/downloadSong.sh ' + url, (err, stdout, stderr) => {
      if(err){
        console.error(`exec error: ${err}`)
        return
      }

      console.log(`stdout: ${stdout}`)
      
    })
    response.status(300)
  }
)

module.exports = router;
