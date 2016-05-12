import Reflux from 'reflux'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'

var song = null

var SongStore = Reflux.createStore({
  listenables: RefluxActions,

  onSetSong: function(_song) {
    song = _song
    this.trigger(song)
  },

  getSong: () => {
    return song
  }
})

module.exports = SongStore