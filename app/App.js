var React = require('react')
var RefluxActions = require('./RefluxActions')
var UserStore = require('./stores/UserStore')
import './styles/app.sass'

var Header = require('./Header')
import MainViewContainer from './MainViews/MainViewContainer'
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
      var authedContent = null;
      if (this.state.user === null) {
        authedContent = <LoginForm />
      } else {
        authedContent = (
          <div>
            You are logged in as {this.state.user.username}
            <MainViewContainer />
            <Chat />
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
