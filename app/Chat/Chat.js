var React = require('react')

var ChatMessages = require('./ChatMessages')
var ChatInput = require('./ChatInput')

var ChatWebsocket = require('./ChatWebsocket')

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
        <div>
          <ChatMessages />
          <ChatInput />
        </div>
      )
    }
}