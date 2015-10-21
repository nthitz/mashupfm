import React from 'react'

import QueueControls from './QueueControls'

export default class MainContainerTabBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div id='tab-bar'>
        <div id='tabs'>
          <div className="tab" id="playlist-button">
            g
          </div>
          <div className="tab active" id="queue-button">
            h
          </div>
          <div className="tab" id="chat-button">
            e
          </div>
          <div className="tab" id="users-button">
            i
          </div>
        </div>
        <QueueControls />
      </div>
    )
  }
}

