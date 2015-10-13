var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var credential = require('credential')

var db = require('./db')

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.query('SELECT * FROM "user" WHERE username=$1', [username])
      .then(function(result) {
        var user = result.rows[0]
        var hash = user.hash
        credential.verify(hash, password, function(error, isValid) {
          if (error) { done(error) }
          if (isValid) {
            done(null, user)
          } else {
            done(null, false)
          }
        })
      })
      .catch(done)
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.query('SELECT * FROM "user" WHERE id=$1', [id])
    .then(function(user) {
      cb(null, user.rows[0])
    }).catch(cb)
});