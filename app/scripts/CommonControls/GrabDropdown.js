var React = require('react')
import request from 'superagent'

import Actions from '../RefluxActions'
import PlaylistStore from '../stores/PlaylistStore.js'

export default class GrabDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: [],
      expanded: false,
      position: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 0,
      }
    }

    this._playlistDataUpdated = this._playlistDataUpdated.bind(this)
    this._open = this._open.bind(this)
  }

  componentDidMount() {
    this._playlistStoreListener = PlaylistStore.listen(this._playlistDataUpdated)
    this._playlistDataUpdated(PlaylistStore.getUserPlaylists())
    Actions.grabDropdown.listen(this._open)
  }

  componentWillUnmount() {
    this._playlistStoreListener()
    Actions.grabDropdown.unlisten(this._open)
  }

  _playlistDataUpdated(playlists) {
    let newState = {
      playlists: playlists
    }
    this.setState(newState)
  }

  _selectPlaylist(event, playlist) {
    this._addSongToPlaylist(playlist, this.state.song)
    event.preventDefault()
    event.stopPropagation()
    this._close()
  }

  _addSongToPlaylist(playlist, song) {
    request.post(['/addSongToPlaylist', song.id, playlist.id].join('/'))
      .end((error, result) => {
        if (error) {
          console.log(error)
          return
        }
        Actions.refreshPlaylist()
      })
  }

  _open(button, active, song) {
    this.setState({
      expanded: active,
      position: button.getBoundingClientRect(),
      song: song,
    })
  }

  _close() {
    this.setState({
      expanded: false,
    })
    Actions.closeGrabDropdown()
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

    let position = {
      left: this.state.position.left - 140,
      top: this.state.position.top + this.state.position.height + 10
    }

    return (
      <div onClick={this._close.bind(this)}
        className={`playlist-dropdown-shade ${this.state.expanded ? 'active': ''}`}>
        <ul className='playlist-dropdown'
          style={position}>
          {playlistGrabList}
        </ul>
      </div>
    )
  }
}

