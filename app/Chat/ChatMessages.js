var React = require('react')
var ChatWebsocket = require('./ChatWebsocket')


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
          <div key={chatIndex} className='message'>
            {chat.userId}: {chat.message}
          </div>
        )
      })
      return (
        <div id='chat'>
          {messages}
        </div>
      )
    }
}