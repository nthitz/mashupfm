var express = require('express');
var router = express.Router();
var passport = require('passport')
var credential = require('credential')

var db = require('../db')

router.post(
  '/login',
  // function(req) { console.log(req.body) }
  passport.authenticate('local'),
  function(request, result) {
    result.json({status: 'success'})
  }
)

router.post(
  '/register',
  function(request, response) {
    db.query(
      'SELECT COUNT(id) FROM "user" WHERE lower(username) = lower($1)',
      [request.body.username]
    ).then((result) => {
      console.log(result)
      if (result.rows.length === 0) {
        console.error(result)
        return response.json({'status': 'error', 'error': 'bad query'})
      }
      var count = +result.rows[0].count
      if (count !== 0) {
        return response.json({'status': 'error', 'error': 'username taken'})
      }

      credential.hash(request.body.password, function(error, hash) {
        if (error) {
          throw error;
        }
        db.query(
          'INSERT INTO "user" (username, hash) VALUES ($1, $2)',
          [request.body.username, hash]
        ).then(() => {
          return response.json({'status': 'success'})
        })
      })

    })
  }
)

router.get(
  '/user',
  function(request, result) {
    if (request.user) {
      result.json(request.user)
      return
    }
    result.json(null)
  }
)

router.get(
  '/auth/getUsernameForPasswordHash',
  function(request, result) {
    if (request.query.hash === undefined) {
      result.json({error: 'no hash provided'})
      return
    }

    db.query(
      'SELECT username FROM "user" WHERE password_change_request_hash = $1',
      [request.query.hash]
    ).then(function(dbresult) {
      if (dbresult.rows.length === 0) {
        result.json({ error: 'bad hash'})
        return
      }
      result.json({
        username: dbresult.rows[0].username
      })

    }).catch(function(error) {
      console.log(error)
    })
  }
)

router.post(
  '/auth/changePassword',
  function(request, result) {
    var username = request.body.username,
      passwordDangerous = request.body.password,
      requestHash = request.body.hash

    credential.hash(passwordDangerous, function(error, hash) {
      if (error) {
        throw error;
      }
      db.query(
        `UPDATE "user" SET
          username=$1,
          hash=$2,
          password_change_request_hash=''
          WHERE password_change_request_hash=$3`,
        [username, hash, requestHash],
        function(error, dbResult) {
          if (error) {
            throw error
          }
          if (dbResult.rowCount === 1) {
            result.json({status: 'success'})
            return
          }
          result.json({
            error: 'something went wrong'
          })
        }
      )
    })
  }
)

module.exports = router;
