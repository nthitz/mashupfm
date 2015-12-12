var React = require('react')
var GrabDropdown = require('../CommonControls/GrabDropdown.js')

import PlaylistStore from '../stores/PlaylistStore.js'


export default class VoteButtons extends React.Component {

  render() {
    return (
      <div>
        <div className="circle upvote-icon" id="upvote">
        </div>
        <GrabDropdown />
        <div className="circle downvote-icon" id="downvote">
        </div>
      </div>
    )
  }
}

