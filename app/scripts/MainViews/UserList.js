import React from 'react'

import UserStore from '../stores/UserStore.js'
import userAuth from '../userAuth'

class UserListItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loggedInUser: null
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
    var className = '';
    if (this.state.loggedInUser && this.props.user) {
      if (this.state.loggedInUser.id === this.props.user.id) {
        className += 'self'
      }
    }
    return (
      <tr className={className}>
        <td>
          <div className='avatar'></div>
        </td>
        <td>
          <div className='username'>{this.props.user.username}</div>
        </td>
        <td>1,442</td>
        <td>2.4</td>
        <td>{this.props.username == 'wallpind' ? '3%' : '89%'}</td>
      </tr>
    )
  }
}

export default class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
    UserStore.listen((data) => {
      this.setState({
        users: _.filter(data, (user) => {
          return user.online
        })
      })
    })
  }

  render() {
    var users = Object.keys(this.state.users).map((userId) => {
      var user = this.state.users[userId]
      return <UserListItem user={user} key={userId} />
    })
    return (
      <div id='users'>
        <div className='scroll-container'>
          <table>
            <thead>
              <tr>
                <td></td>
                <td>user</td>
                <td>score</td>
                <td>average</td>
                <td>upvote ratio</td>
              </tr>
            </thead>
            <tbody>
              {users}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}
