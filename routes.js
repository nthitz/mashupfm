var express = require('express');
var router = express.Router();

var playback = require('./routes/playback')
var archive = require('./routes/archive')
var auth = require('./routes/auth')

router.use(playback.routes)
router.use(archive)
router.use(auth)

module.exports = router
