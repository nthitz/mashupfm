var express = require('express');
var router = express.Router();
var passport = require('passport')

var db = require('../db')


router.post(
  '/login',
  // function(req) { console.log(req.body) }
  passport.authenticate('local'),
  function(request, result) {
    result.json({status: 'success'})
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

module.exports = router;
