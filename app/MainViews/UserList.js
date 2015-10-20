import React from 'react'

import UserStore from '../stores/UserStore.js'

function UserListItem(props) {
  return (
    <div>
      {props.user.id} {props.user.username}
    </div>
  )
}

export default class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
    console.log('attach')
    UserStore.listen((data) => {
      console.log(data)
      this.setState({ users: data })
    })
  }

  render() {
    var users = Object.keys(this.state.users).map((userId) => {
      var user = this.state.users[userId]
      return <UserListItem user={user} key={userId} />
    })
    return (
      <ul>
        {users}
      </ul>
    )
  }

}
