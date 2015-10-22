'use strict'
import React from 'react'

import QueueControls from './QueueControls'
import Icon from '../Icon'

var tabs = [
  'playlist', 'queue', 'chat', 'users'
]

export default class MainContainerTabBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: this.props.defaultTab
    }
  }

  _clickTab(tabIndex) {
    if (tabIndex === this.state.activeTab) {
      return
    }

    this.setState({
      activeTab: tabIndex
    })
    this.props.onTabChange(tabIndex)
  }

  render() {
    let tabIcons = tabs.map((tab, tabIndex) => {
      let className = 'tab'
      if (tabIndex === this.state.activeTab) {
        className += ' active'
      }
      return <Icon
        icon={tab}
        className={className}
        key={tab}
        onClick={this._clickTab.bind(this, tabIndex)} />
    })
    return (
      <div id='tab-bar'>
        <div id='tabs'>
          {tabIcons}
        </div>
        <QueueControls />
      </div>
    )
  }
}
MainContainerTabBar.defaultProps = {
  defaultTab: 0,
  onTabChange: function() {},
}