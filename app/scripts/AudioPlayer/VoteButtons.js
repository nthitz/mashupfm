var React = require('react')
var request = require('superagent');

import PlaylistStore from '../stores/PlaylistStore.js'

export default class VoteButtons extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: []
    }
  }

  componentDidMount() {
    PlaylistStore.listen((data) => {
        console.log("VoteButtons: PlaylistStore update")
        this.setState({
            playlists: data
        })
    })
  }

  render() {
    let playlistGrabList = this.state.playlists.map((playlist, index) => {
      return (
        <li
          className='grabbed'
          key={index}
        >
          {playlist.name}
        </li>
      )
    })
    return (
      <div>
        <div className="circle upvote-icon" id="upvote">
        </div>
        <div className="grab circle grab-icon" id="grab">
          <ul className="playlist-dropdown">
            {playlistGrabList}
          </ul>
        </div>
        <div className="circle downvote-icon" id="downvote">
        </div>
      </div>
    )
  }
}

