var React = require('react')
import md5 from 'md5'

import UserStore from '../stores/UserStore'
import userAuth from '../userAuth'
export default class Avatar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: UserStore.getUserById(props.id)
    }
    UserStore.listen(this._usersUpdated.bind(this))
  }

  _usersUpdated(users) {
    this.setState({
      user: users[this.props.id]
    })
  }
  render() {
    let className = 'avatar';

    let style = {}
    if (this.state.user) {
      let avatarUrl =
        'http://www.gravatar.com/avatar/' +
        md5(this.state.user.username) +
        '?d=retro'
      style = {
        backgroundImage: `url(${avatarUrl})`,
      }
    }
    return (
      <div
        className={className}
        style={style} >
      </div>
    )
  }
}
