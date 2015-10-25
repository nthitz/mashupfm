var React = require('react')
import UserStore from '../stores/UserStore'
import userAuth from '../userAuth'
export default class Username extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: UserStore.getUserById(props.id),
    }
  }

  componentDidMount() {
    userAuth.getUser()
      .then((user) => {
        this.setState({
          loggedInUser: user
        })
      })
  }

  render() {
    let className = 'username';
    if(this.state.user && this.state.loggedInUser) {
      if (this.state.user.id === this.state.loggedInUser.id) {
        className += ' self'
      }
    }
    return (
      <div className={className}>
        {this.state.user.username}:
      </div>
    )
  }
}
