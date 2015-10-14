
var socket = null
var address = [
  'ws://',
  document.location.hostname,
  ':',
  document.location.port,
  '/chatWs'
].join('')

var messageCallback = function() {}

function connect() {
  socket = new WebSocket(address)
  console.log(socket)
}


function send(userId, message) {
  if (socket === null) {
    return
  }
  console.log(arguments)

  // ws.send()
}

function setMessageCallback(callback) {
  messageCallback = callback
}

connect()


module.exports = {
  send: send,
  setMessageCallback: setMessageCallback,
}