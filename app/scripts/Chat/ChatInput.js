var React = require('react')
import _ from 'lodash'

import UserStore from '../stores/UserStore.js'
import Avatar from '../User/Avatar'
var websocket = require('../websocket')
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
        currentUser: null,
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
      userAuth.getUser()
        .then((user) => {
          this.setState({
            currentUser: user
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
      let message = this.refs.input.value

      if (message === '') {
        return
      }
      this.refs.input.value = ''

      userAuth.getUser()
        .then((user) => {
          websocket.sendChat(user.id, message)
        })
    }

    render(){
      let avatar = null
      if (this.state.currentUser) {
        avatar = <Avatar userId={this.state.currentUser.id} />
      }
      return (
        <div id='chat-input'>
          {avatar}
          <textarea
            ref='input'
            onKeyDown={this._keyDown.bind(this)}
            placeholder="Shitpost here" />
        </div>
      )
    }
}
