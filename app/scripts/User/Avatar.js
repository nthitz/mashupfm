var React = require('react')
import md5 from 'md5'

import UserStore from '../stores/UserStore'
import userAuth from '../userAuth'
import botlerImage from 'file!../../assets/images/botler.png'

export default class Avatar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: UserStore.getUserById(props.userId)
    }

    this._usersUpdated = this._usersUpdated.bind(this)
  }

  componentDidMount() {
    this._userStoreUnlisten = UserStore.listen(this._usersUpdated)
  }

  componentWillUnmount() {
    this._userStoreUnlisten()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user:  UserStore.getUserById(nextProps.userId)
    })
  }

  _usersUpdated(users) {
    this.setState({
      user: users[this.props.userId]
    })
  }

  render() {
    let className = 'avatar';

    let style = {}
    let title = null

    if (this.props.default) {
      style = {
        backgroundImage: `url(${botlerImage})`,
      }
      title = 'Alfred the Botler'
    } else if (this.state.user) {
      let avatarUrl =
        'http://www.gravatar.com/avatar/' +
        md5(this.state.user.username) +
        '?d=retro'
      style = {
        backgroundImage: `url(${avatarUrl})`,
      }
      title = this.state.user.username
    }

    return (
      <div
        title={title}
        className={className}
        style={style}
        {...this.props} >
      </div>
    )
  }
}
