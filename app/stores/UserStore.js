import Reflux from 'reflux'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'

var users = {}


var userStore = Reflux.createStore({
  listenables: RefluxActions,

  onUserJoin: function(user) {
    user.online = true
    users[user.id] = user
    this.trigger(users)
    console.log('on user join')
  },

  onUserLeave: function(userId) {
    users[userId].online = false
    this.trigger(users)
  },

  onUserList: function(userList) {
    Object.keys(userList).forEach((userListId) => {
      users[userListId] = userList[userListId]
    })
    this.trigger(users)
    console.log('on user list')
  },

  getUserById: function(userId) {
    return _.find(users, (user) => {
      return user.id === userId
    })
  },

})

module.exports = userStore