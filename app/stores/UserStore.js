import Reflux from 'reflux'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'

var userStore = Reflux.createStore({
  listenables: RefluxActions,

  init: function() {
    this.users = [];
  },
  onUserJoin: function(user) {
    console.log(user)
    this.users.push(user)
    this.trigger(this.users)
  },

  onUserLeave: function(userId) {
    console.log('leave')
    console.log(leavingUser)
    var index = _.findIndex(this.users, (user) => {
      return user.id === userId
    })
    if (index === -1) {
      console.log('a user who isn\'t here is leaving, this is a bug probably')
      return
    }
    this.users.splice(index, 1)
    this.trigger(this.users)
  },

  onUserList: function(userList) {
    this.users = userList
    // ¯\_(ツ)_/¯
  }
})

module.exports = userStore