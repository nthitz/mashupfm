import Reflux from 'reflux'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'

var dj = null

var DjStore = Reflux.createStore({
  listenables: RefluxActions,

  onSetDJ: function(_dj) {
    dj = _dj
    this.trigger(dj)
  },

  getDj: () => {
    return dj
  }
})

module.exports = DjStore