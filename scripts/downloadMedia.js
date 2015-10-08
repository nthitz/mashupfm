require('dotenv').config({path: '../.env'})
var spawn = require('child_process').spawn;
var pg = require('pg')
var _ = require ('lodash')

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
      var args = [song.url]
      var p = spawn(
        'youtube-dl',
        args
      )
      p.stderr.on('data', log)
      p.stdout.on('data', log)
      p.on('error', log)
      p.on('close', log)
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
