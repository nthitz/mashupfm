var socket = null;
var app = null;

var expressWs = require('express-ws')

function initChatSocket(_app) {
  app = _app;
  expressWs = expressWs(app)
  app.ws('/chatWs', function(ws, request) {
    socket = ws
    // s// console.log(ws)
    ws.on('message', function(message) {
      var messageObject = JSON.parse(message)
      if (messageObject.type === 'chat') {
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
