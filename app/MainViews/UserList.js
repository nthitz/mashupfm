import React from 'react'

import UserStore from '../stores/UserStore.js'

function UserListItem(props) {
  return (
    <div>
      {props.user.username}
    </div>
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
        <div>
          Online User List
        </div>
        <ul>
          {users}
        </ul>
      </div>
    )
  }

}
