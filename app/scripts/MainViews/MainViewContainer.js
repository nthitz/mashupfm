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

    let allViews = views.map((View, viewIndex) => {
      let style = {
        display: viewIndex === this.state.tab ? 'block' : 'none'
      }
      return (
        <div style={style} key={viewIndex}>
          {View}
        </div>
      )
    })
    return (
      <div id='main-container'>
        {allViews}
        <MainContainerTabBar
          defaultTab={this.state.tab}
          onTabChange={this._tabChanged.bind(this)} />
      </div>
    )
  }

}

MainViewContainer.defaultProps = {
  defaultTab: 0
}