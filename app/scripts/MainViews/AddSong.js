import React from 'react'
import request from 'superagent'
import _ from 'lodash'

import Icon from '../Icon'
import PlaylistStore from '../stores/PlaylistStore.js'

export default class AddSong extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlists: [],
      selectedPlaylistId: -1
    }


  }
  componentDidMount() {
    this._playlistStoreListener = PlaylistStore.listen(this._playlistDataUpdated)
    this._playlistDataUpdated(PlaylistStore.getUserPlaylists())

  }

  componentWillUnmount() {
    this._playlistStoreListener()
  }

  _playlistDataUpdated(playlists, selected) {
    let newState = {
      playlists: playlists,
      selectedPlaylistId: selected == undefined ? 0 : selected
    }
    this.setState(newState)
  }

  

  _uploadSong(e){
    var icon = document.getElementById('add-song')
    if(!icon.classList.contains('active')){
      icon.classList.add('active')
      document.getElementById('add-song-input').focus()
      return 0
    }

    if(e && e.target.id == 'add-song-input'){
      return 0
    }

    var url = document.getElementById('add-song-input').value
    if(url == ''){
      icon.classList.remove('active')
      return 0
    }

    request.post('/uploadSong/' + PlaylistStore.getSelectedPlaylist())
      .set('Content-Type', 'application/json')
      .send('{"url":"' + url + '"}')
      .end((error, result) => {
        if (error) {
          throw error;
        }
      })
  }

  render() {
    return (
      <Icon icon='add-song' id='add-song' onClick={this._uploadSong}>
        <input id='add-song-input' placeholder='paste song url here' type='text' />
      </Icon>
    )
  }

}
