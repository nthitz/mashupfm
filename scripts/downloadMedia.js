require('dotenv').config({path: '../.env'})
var spawn = require('child_process').spawn;
var pg = require('pg')
var _ = require ('lodash')

var OUTPUT_FOLDER = '../media/';
var OUTPUT_FOLDER_REGEX = /^\.\.\/media\//
var OUTPUT_FORMAT = OUTPUT_FOLDER + '%(title)s-%(id)s.%(ext)s'
var youtubeDL = 'youtube-dl'
var DELAY_BETWEEN_SONGS = 1000;
var COPYRIGHT_INFRINGEMENT = 'The YouTube account associated with this video has been terminated due to multiple third-party notifications of copyright infringement.';
var COPYRIGHT_INFRINGEMENT2 = /(blocked it (in your country )?on copyright grounds)|(no longer available)|(not available)/
var REMOVED = 'This video has been removed'
var SIGNIN_ERROR = 'Please sign in to view this video.'
var NOT_EXIST = 'This video does not exist'
var SC_404 = 'Unable to download JSON metadata: HTTP Error 404';
var NO_VIDEO_FORMATS_ERROR = 'ERROR: No video formats found;'

var songErrorStatuses = {};
songErrorStatuses[COPYRIGHT_INFRINGEMENT] = 'gone';

var defaultYoutubeDLArgs = [
  '--extract-audio',
  '--restrict-filenames',
  '--write-thumbnail',
  '--no-check-certificate',
  '-o', OUTPUT_FORMAT,
]
var songFormats = {
  youtube: {
    id: 1,
    formatter: function (id) {
      return 'http://youtube.com/watch?v=' + id
    }
  },
  soundcloud: {
    id: 2,
    formatter: function (id) {
      return 'http://api.soundcloud.com/tracks/' + id
    }
  }
}

pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
  if (err) {
    console.error(err)
    done()
    return
  }
  attemptDownload()
  function attemptDownload() {
    var format = songFormats['youtube']
    var url = null;
    getNextSong(format)
      .then(function(song) {
        song.url = format.formatter(song.cid)
        return song
      })
      .then(downloadSong)
  }
  function log() {
    console.log(arguments[0].toString())
  }
  function downloadSong(song) {
    return new Promise(function(resolve, reject) {

      var filename = null;
      getFilename();

      function getFilename() {
        var filenameArgs = defaultYoutubeDLArgs.slice(0)
          .concat(['--get-filename', song.url])
        var filenameProcess = spawn(youtubeDL, filenameArgs)
        // filenameProcess.stderr.on('data', log)
        filenameProcess.stdout.on('data', function(data) {
          data = data.toString()
          if (data.match(OUTPUT_FOLDER_REGEX)) {
            filename = data.replace(OUTPUT_FOLDER_REGEX, '').trim();
            console.log('f: ' + filename)
          } else {
            console.log('filename output')
            console.log(data)
          }
        })
        var skipped = false;
        filenameProcess.stderr.on('data', function(error) {

          function skipSong(status) {
            console.log('skipping with status ' + status)
            // console.log(song)
            client.query('UPDATE "song" SET status=$1 WHERE id=$2',
              [status, song.id],
              function(error, result) {
                if (error) {
                  console.log(error)
                  process.exit(1)
                }
                skipped = true;
                setTimeout(attemptDownload, DELAY_BETWEEN_SONGS);
              })
          }
          error = error.toString()

          if (error.indexOf(COPYRIGHT_INFRINGEMENT) !== -1
            || error.match(COPYRIGHT_INFRINGEMENT2)) {
            skipSong('gone')
          } else if(error.indexOf(SIGNIN_ERROR) !== -1) {
            skipSong('signInNeeded');
          } else if(error.indexOf(SC_404) !== -1) {
            skipSong('gone')
          } else if (error.indexOf(NO_VIDEO_FORMATS_ERROR) !== -1) {
            skipSong('no_video_formats')
          } else if (error.indexOf(REMOVED) !== -1) {
            skipSong('gone')
          } else if (error.indexOf(NOT_EXIST) !== -1) {
            skipSong('gone')
          } else {
            console.error('unknown error')
            console.log(error.toString())
          }
        })
        // filenameProcess.on('error', log)
        filenameProcess.on('close', function(code) {
          if (skipped) {
            return;
          }
          if (code === 0 && filename !== null) {
            getMedia()
          } else {
            console.log('invalid state')
            console.log(code.toString())
          }
        })
      }

      function getMedia() {
        var args = defaultYoutubeDLArgs.slice(0)
          .concat([song.url])
        var mediaProcess = spawn(youtubeDL, args);
        mediaProcess.stderr.on('data', log)
        mediaProcess.on('error', log)

        mediaProcess.on('close', function(code) {
          if(code === 0) {
            client.query('UPDATE "song" SET path=$1, status=$2 WHERE id=$3',
              [filename, 'valid', song.id],
              function(error, result) {
                if (error) {
                  console.log(error);
                  process.exit(1)
                }
                console.log(filename);
                setTimeout(attemptDownload, DELAY_BETWEEN_SONGS);
              })
          }
        })
      }

    })
  }
  function getNextSong(type) {
    return new Promise(function(resolve, reject) {
      client.query(
        'SELECT * FROM "song" WHERE status=$1 AND format=$2 LIMIT 1',
        ['unknown', type.id],
        function(error, result) {
          if (error) {
            console.log(error)
            reject(error)
            return
          }
          resolve(result.rows[0])
        }
      )
    })
  }

});
