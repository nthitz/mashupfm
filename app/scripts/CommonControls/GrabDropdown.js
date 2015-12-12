var React = require('react')

import PlaylistStore from '../stores/PlaylistStore.js'

export default class GrabDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: [],
      grabDropdown: {
        expanded: true
      }
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

  _expandDropdown(event) {
    console.log(this)
    console.log(event)
    this.setState({
      grabDropdown: {
        expanded: !this.state.grabDropdown.expanded
      }
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

    let grabDropdownClass = 'playlist-dropdown' +  (this.state.grabDropdown.expanded ? ' expanded' : ' booty')

    return (
        <div 
          className="grab circle grab-icon" 
          id="grab"
          onClick={this._expandDropdown.bind(this)} >
          <ul className={grabDropdownClass}>
            {playlistGrabList}
          </ul>
        </div>
    )
  }
}

