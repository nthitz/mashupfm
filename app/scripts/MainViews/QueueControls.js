import React from 'react'
import request from 'superagent'
import _ from 'lodash'

import RefluxActions from '../RefluxActions'
import DjStore from '../stores/DjStore'
import QueueStore from '../stores/QueueStore'
import userAuth from '../userAuth'

export default class QueueControls extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inQueue: false,
      intendsToStepDown: false,
      dj: DjStore.getDj(),
    }

    this._queueUpdated = this._queueUpdated.bind(this)
    this._djUpdated = this._djUpdated.bind(this)
  }

  componentDidMount() {
    QueueStore.listen(this._queueUpdated)
    userAuth.getUser()
      .then((user) => {
        this.setState({
          user: user,
        })
      })
    this.setState({
      dj: DjStore.getDj(),
    })
    DjStore.listen(this._djUpdated)
  }

  componentWillUnmount() {
    QueueStore.unlisten(this._queueUpdated)
    DjStore.unlisten(this._djUpdated)
  }

  _queueUpdated(queue) {
    this.setState({
      queue: queue,
    })
  }

  _djUpdated(dj) {
    this.setState({
      dj: dj,
      intendsToStepDown: false,
    })
  }

  _toggleJoin(event) {
    let inQueue = this._getUserQueuePosition() !== -1 || this._isDj()
    if (this.state.intendsToStepDown) {
      inQueue = false
    }
    this.setState({
      intendsToStepDown: inQueue
    })

    let endpoint = !inQueue ? '/joinQueue' : '/leaveQueue'
    request.get(endpoint)
      .end((error, response) => {
        console.log(arguments)
      })
  }

  _getUserQueuePosition() {
    if (this.state.queue && this.state.user) {
      return _.findIndex(this.state.queue, (user) => {
        return user.id = this.state.user.id
      })
    }
    return -1
  }

  _isDj() {
    if (this.state.user && this.state.dj) {
      return this.state.user.id === this.state.dj.id
    }
    return false
  }

  render() {

    let userPosition = null;
    let totalUsers = null;

    let inQueue = false

    if (this.state.queue) {
      totalUsers = this.state.queue.length
    }

    let userQueuePosition = this._getUserQueuePosition()

    if(userQueuePosition !== -1) {
      inQueue = true
      userPosition = userQueuePosition + 1
    }

    if (this._isDj()) {
      inQueue = true
      userPosition = 'DJ'
    }

    if (this.state.intendsToStepDown) {
      inQueue = false
    }

    let joinButtonClass = inQueue ?
      'leave-queue-icon' : 'join-queue-icon'

    return (
      <div id='queue-controls' className={inQueue ? 'active' : ''}>
        <div id='join-queue'
          onClick={this._toggleJoin.bind(this)}
          className={joinButtonClass}></div>
        <div id='queue-info'>
          <div id='queue-position'>
            {userPosition}
          </div>
          <div id='queue-total'>
            {totalUsers}
          </div>
        </div>
      </div>

    )
  }
}
