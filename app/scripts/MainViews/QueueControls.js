import React from 'react'
import request from 'superagent'
import _ from 'lodash'

import QueueStore from '../stores/QueueStore'
import userAuth from '../userAuth'

export default class QueueControls extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inQueue: false
    }

    this._queueUpdated = this._queueUpdated.bind(this)
  }

  componentDidMount() {
    QueueStore.listen(this._queueUpdated)
    userAuth.getUser()
      .then((user) => {
        this.setState({
          user: user,
        })
      })
  }

  componentWillUmount() {
    QueueStore.listen(this._queueUpdated)
  }

  _queueUpdated(queue) {
    this.setState({
      queue: queue,
    })
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

    let userPosition = 1;
    let totalUsers = null;

    let joinButtonClass = this.state.inQueue ?
      'leave-queue-icon' : 'join-queue-icon'

    let queueInfo = null
    if (this.state.queue) {
      totalUsers = this.state.queue.length
    }
    if (this.state.queue && this.state.user) {
      userPosition = _.findIndex(this.state.queue, (user) => {
        return user.id = this.state.user.id
      }) + 1
    }
    if (this.state.userPosition !== null) {
      queueInfo = (
        <div id='queue-info'>
          <div id='queue-position'>
            {userPosition}
          </div>
          <div id='queue-total'>
            {totalUsers}
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
