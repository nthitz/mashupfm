import Reflux from 'reflux'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'

var playlists = ['asdf', 'wow']

var playlistStore = Reflux.createStore({
  listenables: RefluxActions,

  get: function(){
      return playlists
  },

  onAddPlaylist: function(playlist){
      //stub
  },
})

module.exports = playlistStore
