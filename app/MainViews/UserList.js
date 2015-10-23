import React from 'react'

import UserStore from '../stores/UserStore.js'

function UserListItem(props) {
  return (
    <tr>
      <td>
        <div class='avatar'></div>
      </td>
      <td>
        <div class='username'>{props.user.username}</div>
      </td>
      <td>1,442</td>
      <td>2.4</td>
      <td>89%</td>
    </tr>
  )
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
    )
  }

}
