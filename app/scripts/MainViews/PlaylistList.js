import React from 'react'
import request from 'superagent'
import _ from 'lodash'

import Icon from '../Icon'
import Playlist from './Playlist'
var RefluxActions = require('../RefluxActions')

export default class PlaylistList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: [],
      selectedPlaylistIndex: -1,
      activePlaylistIndex: -1,
    }
  }
  componentDidMount() {
    request.get('/getUserPlaylists')
      .end((error, result) => {
        if (error) {
          throw error;
        }
        let playlists = JSON.parse(result.text)
        let newState = {
          playlists: playlists
        }

        let activePlaylistIndex = _.findIndex(playlists, (playlist) => {
          return playlist.active
        })
        if (activePlaylistIndex !== -1) {
          newState.selectedPlaylistIndex = activePlaylistIndex
          newState.activePlaylistIndex = activePlaylistIndex
          playlists[activePlaylistIndex].active = false
        } else {
          newState.selectedPlaylistIndex = 0
        }

        this.setState(newState)
      })

    RefluxActions.getUserPlaylists.listen(this._getUserPlaylists)
    console.log('CDM - PlaylistList')
  }

  _getUserPlaylists() {
      return [this.state.playlists, 'test']
  }

  _selectPlaylist(index) {
    this.setState({
      selectedPlaylistIndex: index
    })
  }

  _activatePlaylist(index) {
    let playlistId = this.state.playlists[index].id
    request.get('/setActivePlaylist/' + playlistId)
      .end((error, result) => {
        if (error) {
          throw error;
        }
      })
    this.setState({
      activePlaylistIndex: index
    })
  }

  render() {
    let playlistSidebarLists = this.state.playlists.map((playlist, index) => {
      var liClassName = '';
      if (index === this.state.selectedPlaylistIndex) {
        liClassName += ' selected'
      }
      if (index === this.state.activePlaylistIndex) {
        liClassName += ' queued'
      }
      return (
        <li
          onClick={this._selectPlaylist.bind(this, index)}
          className={liClassName}
          key={index}
        >
          <span style={{right: 'auto'}}>{playlist.name}</span>
          <span>
            ##
          </span>
          <Icon
            icon='play'
            className='activate'
            onClick={this._activatePlaylist.bind(this, index)}
          />
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
