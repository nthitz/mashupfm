var React = require('react')
var RefluxActions = require('./RefluxActions')
var UserStore = require('./stores/UserStore')
var QueueStore = require('./stores/QueueStore')
import DjStore from './stores/DjStore'

import '../styles/app.sass'

var Header = require('./Header')
import MainViewContainer from './MainViews/MainViewContainer'
var LoginForm = require('./LoginForm')
var Chat = require('./Chat/Chat')

var userAuth = require('./userAuth')
var websocket = require('./websocket')

export default class App extends React.Component {
    constructor() {
      super()

      this.state = {
        user: null
      }
    }

    componentDidMount() {
      userAuth.getUser()
        .then((user) => {
          this.setState({
            user: user,
          })
          websocket.connect()
        })
    }

    render(){
      var authedContent = null;
      if (this.state.user === null) {
        authedContent = (
          <div id='content'>
            <LoginForm />
          </div>
        )
      } else {
        authedContent = (
          <div id='content'>
            <MainViewContainer />
            <div id='right-container'>
              <Chat />
            </div>
          </div>
        );
      }
      return (
        <div>
          <Header />
          {authedContent}
          {this.props.children}
        </div>
      )
    }
}
