var React = require('react')
var websocket = require('../websocket')
import Username from '../User/Username'
import Avatar from '../User/Avatar'
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
      websocket.setChatMessageCallback(this._onChatMessage.bind(this))
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
            <Avatar userId={chat.userId} />
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
