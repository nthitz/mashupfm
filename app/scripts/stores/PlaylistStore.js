import Reflux from 'reflux'
import _ from 'lodash'
var request = require('superagent');

import RefluxActions from '../RefluxActions'

var playlists = []

var playlistStore = Reflux.createStore({
  init: function(){
    request.get('/getUserPlaylists')
      .end((error, result) => {
        if (error) {
          throw error;
        }
        playlists = JSON.parse(result.text)
        this.trigger(playlists)
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
