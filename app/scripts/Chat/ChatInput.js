var React = require('react')
import _ from 'lodash'
import UserStore from '../stores/UserStore.js'

var ChatWebsocket = require('./ChatWebsocket')
var userAuth = require('../userAuth')

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

    _inputChange(event) {
      this.setState({
        input: event.target.value,
      })
    }

    _keyDown(event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        if(this.state.input.trim() !== ''){
          this._send()
          _.defer(() => {
            this.state.input = ''
            this.refs.input.value = ''
          })
        }
      }
      if (event.keyCode === 9) {
        event.preventDefault()
        var currentMessage = this.state.input.split(" ")
        for(var i = 0; i < this.state.users.length; i++){
          if(this.state.users[i].username.indexOf(currentMessage[currentMessage.length - 1]) == 0){
            currentMessage[currentMessage.length - 1] = this.state.users[i].username
            this.refs.input.value = currentMessage.join(' ')
            this.state.input = this.refs.input.value
            return
          }
        }
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
            onKeyDown={this._keyDown.bind(this)}
            placeholder="Shitpost here" />
        </div>
      )
    }
}
