var expressWs = require('express-ws')
var _ = require('lodash')

var ServerActions = require('../ServerActions')
var Playback = require('./playback')
var app = null;

var activeUsers = {}
var activeSockets = {}

var broadcast = null
function initSocket(_app) {
  app = _app;
  expressWs = expressWs(app)
  broadcast = (message) => {
    expressWs.getWss('/ws')
      .clients.forEach(function(client) {
        client.send(message)
      }
    )
  }
  app.ws('/ws', function(ws, request) {
    if (typeof request.user === 'undefined') {
      ws.close()
      console.log('closing no user')
      return
    }
    activeUsers[request.user.id] = request.user
    activeSockets[request.user.id] = ws

    ws.send(JSON.stringify({
      type: 'userList',
      data: activeUsers
    }))
    ws.send(JSON.stringify({
      type: 'queueChanged',
      data: Playback.getQueue(),
    }))
    broadcast(JSON.stringify({
      type: 'userJoin',
      data: request.user
    }))

    ws.on('message', function(message) {
      var messageObject = JSON.parse(message)
      if (messageObject.type === 'chat') {
        if(messageObject.data.userId !== request.user.id) {
          console.log('someone trying to impersonate chat messages?')
          return
        }
        messageObject.data.time = Date.now()
        if (isCommand(messageObject)) {
          return
        }
        broadcast(JSON.stringify(messageObject))
      }
    })


    ws.on('close', function() {
      delete activeUsers[request.user.id]
      delete activeSockets[request.user.id]
      broadcast(JSON.stringify({
        type: 'userLeave',
        data: request.user.id
      }))
    })
  })
}

var commands = [
  {
    command: '/skip',
    action: () => {
      ServerActions.forceSkip()
    },
  },
]
function isCommand(message) {
  var match = false
  commands.forEach((command) => {
    if (match) {
      return
    }
    if (message.data.message === command.command) {
      command.action()
      console.log('command ' + command.command)
      match = true;
    }
  })
  return match
}

function isUserOnline(userId) {
  return typeof activeUsers[userId] !== 'undefined'
}

ServerActions.forceClientNewSong.listen(() => {
  broadcast(JSON.stringify({ type: 'newSong' }))
})
ServerActions.queueChanged.listen((queue) => {
  broadcast(JSON.stringify({
    type: 'queueChanged',
    data: queue
  }))
})
ServerActions.forceRefreshPlaylist.listen((userId) => {
  if (activeSockets[userId]) {
    activeSockets[userId].send(JSON.stringify({ type: 'refreshPlaylist' }))
  } else {
    console.log('trying to force playlist refresh for unknown user ' + userId)
  }
})


module.exports = {
  initSocket: initSocket,
  isUserOnline: isUserOnline,
}
