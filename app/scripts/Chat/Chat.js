var React = require('react')

var ChatMessages = require('./ChatMessages')
var ChatInput = require('./ChatInput')


export default class Chat extends React.Component {
    constructor() {
      super()

      this.state = {
      }
    }

    componentDidMount() {
    }

    render() {
      return (
        <div id='chat-container'>
          <ChatMessages />
          <ChatInput />
        </div>
      )
    }
}