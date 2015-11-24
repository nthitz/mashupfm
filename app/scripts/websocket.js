import request from 'superagent'

import RefluxActions from './RefluxActions'


var socket = null
var address = [
  'ws://',
  document.location.hostname,
  ':',
  document.location.port,
  '/ws'
].join('')

var chatMessageCallback = function() {}

function connect() {
  request.get('/user')
    .end((error, response) => {
      if (error) { throw error }
      let data = JSON.parse(response.text)
      if (data) {
        socket = new WebSocket(address)
        socket.onmessage = function(message) {
          var messageObject = JSON.parse(message.data)
          handleMessage(messageObject)
        }
        socket.onclose = (closeEvent) => {
          console.error(closeEvent)
          setTimeout(connect, 1)
        }

      }
    })

}

function handleMessage(message) {
  switch (message.type) {
    case "chat":
      chatMessageCallback(message.data)
      break;
    case 'userJoin':
    case 'userLeave':
    case 'userList':
    case 'newSong':
    case 'refreshPlaylist':
      RefluxActions[message.type](message.data)
      break;
    default:
      console.log('unhandled message type')
      console.log(message)
      break;
  }
}

function sendChat(userId, message) {
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


module.exports = {
  connect: connect,
  sendChat: sendChat,
  setChatMessageCallback: setChatMessageCallback,
}