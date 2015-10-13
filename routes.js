var express = require('express');
var router = express.Router();

var playback = require('./routes/playback')
var archive = require('./routes/archive')

router.use(playback.routes)
router.use(archive)

module.exports = router
