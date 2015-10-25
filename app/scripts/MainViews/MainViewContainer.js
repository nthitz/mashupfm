import React from 'react'

import UserList from './UserList'
import PlaylistList from './PlaylistList'
import MainContainerTabBar from './MainContainerTabBar'

let views = [
  <PlaylistList />,
  <UserList />,
  <UserList />,
  <UserList />,
]

export default class MainViewContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tab: this.props.defaultTab
    }
  }

  _tabChanged(tab) {
    this.setState({
      tab: tab
    })
  }

  render() {
    let view = views[this.state.tab]

    if (view === undefined) {
      view = views[0]
    }

    return (
      <div id='main-container'>
        {view}
        <MainContainerTabBar
          defaultTab={this.state.tab}
          onTabChange={this._tabChanged.bind(this)} />
      </div>
    )
  }

}

MainViewContainer.defaultProps = {
  defaultTab: 3
}