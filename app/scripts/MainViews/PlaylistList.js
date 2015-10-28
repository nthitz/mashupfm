import React from 'react'
import request from 'superagent'

import Icon from '../Icon'
import Playlist from './Playlist'

export default class PlaylistList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: [],
      selectedPlaylistIndex: -1,
    }
  }
  componentDidMount() {
    request.get('/getUserPlaylists')
      .end((error, result) => {
        if (error) {
          throw error;
        }
        this.setState({
          playlists: JSON.parse(result.text),
          selectedPlaylistIndex: 0,
        })
      })
  }

  _selectPlaylist(index) {
    this.setState({
      selectedPlaylistIndex: index
    })
  }

  render() {
    let playlistSidebarLists = this.state.playlists.map((playlist, index) => {
      var liClassName = '';
      if (index === this.state.selectedPlaylistIndex) {
        liClassName += ' selected'
      }
      return (
        <li
          onClick={this._selectPlaylist.bind(this,index)}
          className={liClassName}
          key={index}
        >
          <span style={{right: 'auto'}}>{playlist.name}</span>
          <span>
            ##
          </span>
          <Icon icon='play' className='activate' />
        </li>
      )
    })
    let selectedPlaylist = null
    if (this.state.selectedPlaylistIndex !== -1) {
      selectedPlaylist = this.state.playlists[this.state.selectedPlaylistIndex]
    }
    return (
      <div id='playlists'>
        <div id='playlist-topbar'>
          <Icon icon='grab' id='add-playlist'>
            Add New Playlist
          </Icon>
          <div id='playlist-name'>
            {selectedPlaylist ? selectedPlaylist.name : ''}
          </div>
          <Icon icon='add-song' id='add-song'>
            <input id='add-song-input' placeholder='paste song url here' type='text' />
          </Icon>
        </div>
        <div id='playlist-sidebar'>
          <ul>
            {playlistSidebarLists}
          </ul>
        </div>
        <Playlist playlist={selectedPlaylist} />
      </div>
    )
  }

}
