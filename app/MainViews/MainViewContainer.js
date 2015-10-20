import React from 'react'

import UserList from './UserList'

export default class MainViewContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <UserList />
      </div>
    )
  }

}
