import Reflux from 'reflux'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'

var queue = null


var userStore = Reflux.createStore({
  listenables: RefluxActions,

  onQueueChanged: function(_queue) {
    console.log('store queue', _queue)
    queue = _queue
    this.trigger(queue)
  },

  getQueue: () => {
    return queue
  }
})

module.exports = userStore