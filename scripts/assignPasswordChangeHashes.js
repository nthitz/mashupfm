require('dotenv').config({path: '../.env'})
var pg = require('pg')
var _ = require ('lodash')
var crypto = require('crypto')

pg.connect(process.env.PG_CONNECTION, function(err, client, done) {
  client.query('SELECT * FROM "user"', function(error, result) {
    if (error) {
      console.log(error);
      return;
    }

    result.rows.forEach(function(row) {
      console.log(row);
      new Promise(function(resolve) {
        crypto.randomBytes(32, function(ex, buf) {
          var token = buf.toString('hex');
          resolve(token)
        })
      }).then(function(hash) {
        console.log(row.username+ ": " + '/#/changePassword?hash=' + hash)
        client.query(
          'UPDATE "user" SET "password_change_request_hash"=$1 WHERE id=$2',
          [hash, row.id],
          function(error) {
            if (error) {
              console.log(error);
              return
            }
            console.log('done')
          }
        )
      })
    })
  })
})