var React = require('react')
import _ from 'lodash'

var ChatWebsocket = require('./ChatWebsocket')
var userAuth = require('../userAuth')

export default class ChatInput extends React.Component {
    constructor() {
      super()

      this.state = {
        input: '',
        sending: false,
      }
    }

    componentDidMount() {

    }

    _inputChange(event) {
      this.setState({
        input: event.target.value,
      })
    }

    _keyPress(event) {
      if (event.charCode === 13) {
        this._send()
        _.defer(() => {
          this.refs.input.value = ''
        })
      }
    }

    _send() {
      userAuth.getUser()
        .then((user) => {
          ChatWebsocket.send(user.id, this.state.input)
        })
    }

    render(){
      return (
        <div id='chat-input'>
          <div className="avatar"></div>
          <textarea
            ref='input'
            onChange={this._inputChange.bind(this)}
            onKeyPress={this._keyPress.bind(this)}
            placeholder="Shitpost here" />
        </div>
      )
    }
}