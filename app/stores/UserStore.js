import Reflux from 'reflux'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'

var userStore = Reflux.createStore({
  listenables: RefluxActions,

  init: function() {
    this.users = {};
  },
  onUserJoin: function(user) {
    this.users[user.id] = user
    this.trigger(this.users)
    console.log('on user join')
  },

  onUserLeave: function(userId) {
    delete this.users[userId]
    this.trigger(this.users)
  },

  onUserList: function(userList) {
    Object.keys(userList).forEach((userListId) => {
      this.users[userListId] = userList[userListId]
    })
    this.trigger(this.users)
    console.log('on user list')
  }
})

module.exports = userStore