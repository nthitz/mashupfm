"use strict"
var db = require('../db')

var playlistHelper = {
  updateOrder: function(user, playlist, order){
    db.query(
      'SELECT COUNT(*) AS count FROM playlist WHERE id = $1 AND user_id=$2',
      [playlist, user]
    ).then((result) => {
      return new Promise((resolve, reject) => {
        if (result.rows[0].count == 1) { //count returns as a string so `==`
          resolve()
        }
        reject('not a playlist of logged in user')
      })
    }).then(() => {
      let orderString = order.map((songId) => {
        return parseInt(songId, 10)
      }).join(',')
      return db.query(
        `UPDATE playlist SET sort='{${orderString}}' WHERE id=$1`,
        [playlist]
      )
    }).catch((error) => {
      console.log(error)
      return(playlistHelper.callbacks('error'))
    })
    return(playlistHelper.callbacks('success'))
  },
  callbacks: function(response){
    return({
      error: function(error){
        if(error && response == 'error') error()
        return this
      },
      success: function(success){
        if(success && response == 'success') success()
        return this
      }
    })
  }
}

module.exports = playlistHelper
