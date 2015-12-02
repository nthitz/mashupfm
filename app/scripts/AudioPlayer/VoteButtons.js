var React = require('react')

import PlaylistStore from '../stores/PlaylistStore.js'

export default class VoteButtons extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: []
    }

    this._playlistDataUpdated = this._playlistDataUpdated.bind(this)
  }

  componentDidMount() {
    this._playlistStoreListener = PlaylistStore.listen(this._playlistDataUpdated)
    this._playlistDataUpdated(PlaylistStore.getUserPlaylists())
  }

  _playlistDataUpdated(playlists) {
    let newState = {
      playlists: playlists
    }
    this.setState(newState)
  }

  componentWillUnmount() {
    this._playlistStoreListener()
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

