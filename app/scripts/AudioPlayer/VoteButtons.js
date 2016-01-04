var React = require('react')
import GrabButton from '../CommonControls/GrabButton'

import PlaylistStore from '../stores/PlaylistStore.js'


export default class VoteButtons extends React.Component {

  render() {
    return (
      <div>
        <div className="circle upvote-icon" id="upvote">
        </div>
        <GrabButton />
        <div className="circle downvote-icon" id="downvote">
        </div>
      </div>
    )
  }
}

