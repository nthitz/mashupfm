import Reflux from 'reflux'
import _ from 'lodash'
var request = require('superagent');
import userAuth from '../userAuth'

import RefluxActions from '../RefluxActions'

var playlists = []

var playlistStore = Reflux.createStore({
  init: function(){
    userAuth.getUser()
      .then((user) => {
        if (!user) return
        request.get('/getUserPlaylists')
          .end((error, result) => {
            if (error) {
              throw error;
            }
            playlists = JSON.parse(result.text)
            this.trigger(playlists)
        })
      })

  },

  listenables: RefluxActions,

  getUserPlaylists: function(){
    return playlists
  },

  onAddPlaylist: function(playlist){
      //stub
  },
})

module.exports = playlistStore
