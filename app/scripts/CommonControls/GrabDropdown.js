var React = require('react')

import PlaylistStore from '../stores/PlaylistStore.js'

export default class GrabDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: [],
      expanded: false
    }

    this._playlistDataUpdated = this._playlistDataUpdated.bind(this)
  }

  componentDidMount() {
    this._playlistStoreListener = PlaylistStore.listen(this._playlistDataUpdated)
    this._playlistDataUpdated(PlaylistStore.getUserPlaylists())
  }

  componentWillUnmount() {
    this._playlistStoreListener()
  }

  _playlistDataUpdated(playlists) {
    let newState = {
      playlists: playlists
    }
    this.setState(newState)
  }


  _expandDropdown(event) {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  _selectPlaylist(event, playlist) {
    console.log(playlist)
    event.preventDefault()
    event.stopPropagation()
    this.setState({
      expanded: false
    })
  }

  render() {
    let playlistGrabList = this.state.playlists.map((playlist, index) => {
      return (
        <li
          onClick={(event) => {
            this._selectPlaylist(event, playlist)}
          }
          className='grabbed'
          key={index}>
          {playlist.name}
        </li>
      )
    })
    return (
        <div
          className={`grab circle grab-icon ${this.state.expanded ? 'active' : ''}`}
          id="grab"
          onClick={this._expandDropdown.bind(this)} >
          <ul className='playlist-dropdown'>
            {playlistGrabList}
          </ul>
        </div>
    )
  }
}

