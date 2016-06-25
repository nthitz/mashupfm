import Reflux from 'reflux'
import _ from 'lodash'
var request = require('superagent');
import userAuth from '../userAuth'

import RefluxActions from '../RefluxActions'

var playlists = []
var selected = null
var active = null

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

            active = playlists[_.findIndex(playlists, (playlist) => {
              return playlist.active
            })].id

            selected = selected == null ? active : selected

            this.trigger(selected)
            this.trigger(active)
        })
      })

  },

  listenables: RefluxActions,

  getUserPlaylists: function(){
    return playlists
  },

  getSelectedPlaylist: function(){
    return selected
  },

  setSelectedPlaylist: function(playlist){
    selected = playlist
  },

  onAddPlaylist: function(playlist){
      //stub
  },
})

module.exports = playlistStore
