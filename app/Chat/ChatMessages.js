var React = require('react')
var ChatWebsocket = require('./ChatWebsocket')
import Username from '../User/Username'

export default class ChatMessages extends React.Component {
    constructor() {
      super()

      this.state = {
        messages: []
      }
    }

    _onChatMessage(message) {
      this.setState({
        messages: this.state.messages.slice(0).concat([message])
      })
    }

    componentDidMount() {
      ChatWebsocket.setChatMessageCallback(this._onChatMessage.bind(this))
    }

    render(){
      var messages = this.state.messages.map((chat, chatIndex) => {
        return (
          <li key={chatIndex} className='message-container'>
            <div className='avatar'></div>
            <Username id={chat.userId} />
            <div className="message">
              {chat.message}
              <div className="timestamp">
                4:20
              </div>
            </div>
          </li>
        )
      })
      return (
        <div id='chat'>
          <div id='chat-messages'>
            <ul>
              {messages}
            </ul>
          </div>
        </div>
      )
    }
}