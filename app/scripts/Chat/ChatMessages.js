<<<<<<< HEAD
var React = require('react')
var ChatWebsocket = require('./ChatWebsocket')
import Username from '../User/Username'
import userAuth from '../userAuth'
import _ from 'lodash'

export default class ChatMessages extends React.Component {
    constructor() {
      super()

      this.state = {
        messages: [],
        loggedInUser: null
      }

      this.bottomOfList = true;
      window.addEventListener('focus', function(){
        document.title = document.title.indexOf("* ") == 0 ? document.title.slice(2) : document.title
      })
    }

    _onChatMessage(message) {
      this.setState({
        messages: this.state.messages.slice(0).concat([message])
      })
      if(!document.hasFocus() && this.state.loggedInUser.id !== message.userId)
        document.title = document.title.indexOf("* ") == 0 ? document.title : "* " + document.title
    }

    _onChatScroll(event) {
      let {target} = event
      let {scrollTop, clientHeight, scrollHeight} = target

      this.bottomOfList = scrollTop + clientHeight >= scrollHeight
    }

    componentDidMount() {
      ChatWebsocket.setChatMessageCallback(this._onChatMessage.bind(this))
      userAuth.getUser()
        .then((user) => {
          this.setState({
            loggedInUser: user
          })
        })
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.bottomOfList) {
        this.refs.chat.scrollTop = this.refs.chat.scrollHeight
      }
    }

    render(){
      var messages = this.state.messages.map((chat, chatIndex) => {
        var timeString = new Date(chat.time).toLocaleTimeString()
        return (
          <li key={chatIndex} className='message-container'>
            <div className='avatar'></div>
            <Username id={chat.userId} />
            <div className="message">
              {chat.message}
              <div className="timestamp">
                <time>{timeString}</time>
              </div>
            </div>
          </li>
        )
      })
      var scrollHandler = _.throttle(this._onChatScroll, 100).bind(this)
      return (
        <div id='chat' ref='chat' onScroll={scrollHandler}>
          <div id='chat-messages'>
            <ul>
              {messages}
            </ul>
          </div>
        </div>
      )
    }
}
=======
﻿var React = require('react')
var ChatWebsocket = require('./ChatWebsocket')
import Username from '../User/Username'
import userAuth from '../userAuth'
import _ from 'lodash'

export default class ChatMessages extends React.Component {
    constructor() {
      super()

      this.state = {
        messages: [],
        loggedInUser: null
      }

      this.bottomOfList = true;
      window.addEventListener('focus', function(){
        document.title = document.title.indexOf("* ") == 0 ? document.title.slice(2) : document.title
      })
    }

    _onChatMessage(message) {
      this.setState({
        messages: this.state.messages.slice(0).concat([message])
      })
      if(!document.hasFocus() && this.state.loggedInUser.id !== message.userId)
        document.title = document.title.indexOf("* ") == 0 ? document.title : "* " + document.title
    }

    _onChatScroll(event) {
      let {target} = event
      let {scrollTop, clientHeight, scrollHeight} = target

      this.bottomOfList = scrollTop + clientHeight >= scrollHeight
    }

    componentDidMount() {
      ChatWebsocket.setChatMessageCallback(this._onChatMessage.bind(this))
      userAuth.getUser()
        .then((user) => {
          this.setState({
            loggedInUser: user
          })
        })
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.bottomOfList) {
        this.refs.chat.scrollTop = this.refs.chat.scrollHeight
      }
    }

    render(){
      var messages = this.state.messages.map((chat, chatIndex) => {
        var timeString = new Date(chat.time).toLocaleTimeString()
        return (
          <li key={chatIndex} className='message-container'>
            <div className='avatar'></div>
            <Username id={chat.userId} />
            <div className="message">
              {chat.message}
              <div className="timestamp">
                <time>{timeString}</time>
              </div>
            </div>
          </li>
        )
      })
      var scrollHandler = _.throttle(this._onChatScroll, 100).bind(this)
      return (
        <div id='chat' ref='chat' onScroll={scrollHandler}>
          <div id='chat-messages'>
            <ul>
              {messages}
            </ul>
          </div>
        </div>
      )
    }
}
>>>>>>> 7a3aa860994843a310d99b1154fca23c11e5b890
