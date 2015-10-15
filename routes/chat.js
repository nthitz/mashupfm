var expressWs = require('express-ws')

var app = null;

function initChatSocket(_app) {
  app = _app;
  expressWs = expressWs(app)
  app.ws('/chatWs', function(ws, request) {
    ws.on('message', function(message) {
      var messageObject = JSON.parse(message)
      if (messageObject.type === 'chat') {
        if(messageObject.data.userId !== request.user.id) {
          console.log('someone trying to impersonate chat messages?')
          return
        }
        expressWs.getWss('/chatWs')
          .clients.forEach(function(client) {
            client.send(message)
          })
      }
    })
  })
}

module.exports = {
  useChatWebsocket: initChatSocket
}
