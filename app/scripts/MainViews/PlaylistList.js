import React from 'react'
import request from 'superagent'
import _ from 'lodash'

import Icon from '../Icon'
import Playlist from './Playlist'
import AddSong from './AddSong'
import PlaylistStore from '../stores/PlaylistStore.js'

export default class PlaylistList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: [],
      selectedPlaylistIndex: -1,
      activePlaylistIndex: -1,
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
  }

  _selectPlaylist(index, id) {
    PlaylistStore.setSelectedPlaylist(id)
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

  _createNewPlaylist(e){
    let dom = document.getElementById('add-playlist')
    if(dom.classList.contains('active')){
      if(e.target.id == 'add-playlist-input-submit'){
        request.post('/createPlaylist')
          .set('Content-Type', 'application/json')
          .send('{"name":"' + document.getElementById('add-playlist-input').value + '"}')
          .end((error, result) => {
            if (error) {
              throw error;
            }
            if(result.statusCode == 200){
              dom.classList.remove('active')
              PlaylistStore.init()

            }
          })
      }
    }
    else {
      dom.classList.add('active')
      setTimeout(function(){
        document.getElementById('add-playlist-input').focus()
      }, 200)
    }
  }

  componentWillUnmount() {
    this._playlistStoreListener()
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
          onClick={this._selectPlaylist.bind(this, index, playlist.id)}
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
          <Icon 
            icon='grab' 
            id='add-playlist'
            onClick={this._createNewPlaylist}
          >
            Add New Playlist
            <input type='text' id='add-playlist-input' placeholder='playlist name'></input>
            <Icon 
              icon='checkmark' 
              id='add-playlist-input-submit'
            >
            </Icon>
              
          </Icon>
          <div id='playlist-name'>
            {selectedPlaylist ? selectedPlaylist.name : ''}
          </div>
          <AddSong/>
        </div>
        <div id='playlist-sidebar'>
          <ul className='sidebarUl'>
            {playlistSidebarLists}
          </ul>
        </div>
        <Playlist playlist={selectedPlaylist} />
      </div>
    )
  }

}
