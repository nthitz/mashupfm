var expressWs = require('express-ws')
var _ = require('lodash')

var app = null;

var activeUsers = {}

function initChatSocket(_app) {
  app = _app;
  expressWs = expressWs(app)
  function broadcast(message) {
    expressWs.getWss('/chatWs')
      .clients.forEach(function(client) {
        client.send(message)
      }
    )
  }
  app.ws('/chatWs', function(ws, request) {
    if (typeof request.user === 'undefined') {
      ws.close()
      console.log('closing no user')
      return
    }
    activeUsers[request.user.id] = request.user
    ws.send(JSON.stringify({
      type: 'userList',
      data: activeUsers
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
        broadcast(message)
      }
    })


    ws.on('close', function() {
      delete activeUsers[request.user.id]
      broadcast(JSON.stringify({
        type: 'userLeave',
        data: request.user.id
      }))
    })
  })
}

module.exports = {
  useChatWebsocket: initChatSocket,
}
