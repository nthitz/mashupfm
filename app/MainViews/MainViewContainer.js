import React from 'react'

import UserList from './UserList'
import MainContainerTabBar from './MainContainerTabBar'

export default class MainViewContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div id='main-container'>
        <UserList />
        <MainContainerTabBar />
      </div>
    )
  }

}
