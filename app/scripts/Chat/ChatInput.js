var React = require('react')
import _ from 'lodash'
import UserStore from '../stores/UserStore.js'

var ChatWebsocket = require('./ChatWebsocket')
var userAuth = require('../userAuth')


const RETURN_KEYCODE = 13
const TAB_KEYCODE = 9

export default class ChatInput extends React.Component {
    constructor() {
      super()

      this.state = {
        input: '',
        sending: false,
        users: [],
      }
    }

    componentDidMount() {
      UserStore.listen((data) => {
        this.setState({
          users: _.filter(data, (user) => {
            return user.online
          })
        })
      })
    }

    _keyDown(event) {
      if (event.keyCode === RETURN_KEYCODE) {
        event.preventDefault()
        this._send()
        return
      }
      if (event.keyCode === TAB_KEYCODE) {
        event.preventDefault()
        var currentMessage = this.refs.input.value.split(" ")
        var lastToken = currentMessage[currentMessage.length - 1]
        if (lastToken.trim() === '') {
          return
        }
        _.each(this.state.users, (user) => {
          if (user.username.indexOf(lastToken) === 0) {
            currentMessage[currentMessage.length - 1] = user.username
          }
          this.refs.input.value = currentMessage.join(' ')
        })
      }
    }

    _send() {
      let message = this.refs.input.value.trim()
      if (message === '') {
        return
      }
      this.refs.input.value = ''

      userAuth.getUser()
        .then((user) => {
          ChatWebsocket.send(user.id, message)
        })
    }

    render(){
      return (
        <div id='chat-input'>
          <div className="avatar"></div>
          <textarea
            ref='input'
            onKeyDown={this._keyDown.bind(this)}
            placeholder="Shitpost here" />
        </div>
      )
    }
}
