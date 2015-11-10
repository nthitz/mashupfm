import React from 'react'
import request from 'superagent'

export default class QueueControls extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userPosition: null,
      totalUsers: null,
      inQueue: false
    }
  }

  _toggleJoin(event) {
    let inQueue = !this.state.inQueue
    this.setState({
      inQueue: inQueue
    })
    let endpoint = inQueue ? '/joinQueue' : '/leaveQueue'
    request.get(endpoint)
      .end((error, response) => {
        console.log(arguments)
      })
  }

  render() {
    let joinButtonClass = this.state.inQueue ?
      'leave-queue-icon' : 'join-queue-icon'

    let queueInfo = null

    if (this.state.userPosition !== null) {
      queueInfo = (
        <div id='queue-info'>
          <div id='queue-position'>
            {this.state.userPosition}
          </div>
          <div id='queue-total'>
            {this.state.totalUsers}
          </div>
        </div>
      )
    }
    return (
      <div id='queue-controls' className={this.state.inQueue ? 'active' : ''}>
        <div id='join-queue'
          onClick={this._toggleJoin.bind(this)}
          className={joinButtonClass}></div>
        {queueInfo}
      </div>

    )
  }
}
