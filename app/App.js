var React = require('react')
var request = require('superagent')

var AudioPlayer = require('./AudioPlayer')
var LoginForm = require('./LoginForm')
var Chat = require('./Chat/Chat')

var userAuth = require('./userAuth')

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
        })
    }

    render(){
      var loginForm = null;
      if (this.state.user === null) {
        loginForm = <LoginForm />
      } else {
        loginForm = (
          <div>
            You are logged in as {this.state.user.username}
            <Chat />
          </div>
        );
      }
      return (
        <div>
          <AudioPlayer />
          {loginForm}
        </div>
      )
    }
}
