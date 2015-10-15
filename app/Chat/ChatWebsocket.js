
var socket = null
var address = [
  'ws://',
  document.location.hostname,
  ':',
  document.location.port,
  '/chatWs'
].join('')

var chatMessageCallback = function() {}

function connect() {
  socket = new WebSocket(address)
  socket.onmessage = function(message) {
    var messageObject = JSON.parse(message.data)
    handleMessage(messageObject)
  }
}

function handleMessage(message) {
  switch (message.type) {
    case "chat":
      chatMessageCallback(message.data)
      break;
  }
}

function send(userId, message) {
  if (socket === null) {
    return
  }
  socket.send(JSON.stringify({
    type: 'chat',
    data: {
      userId: userId,
      message: message,
    }
  }))
}

function setChatMessageCallback(callback) {
  chatMessageCallback = callback
}

connect()


module.exports = {
  send: send,
  setChatMessageCallback: setChatMessageCallback,
}