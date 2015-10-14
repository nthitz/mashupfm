var socket = null;
var app = null;

function initChatSocket(_app) {
  app = _app;
  app.ws('/chatWs', function(ws, request) {
    socket = ws
    // s// console.log(ws)
    ws.on('message', function(message) {
      console.log(message)
    })
  })

}
module.exports = {
  useChatWebsocket: initChatSocket
}
