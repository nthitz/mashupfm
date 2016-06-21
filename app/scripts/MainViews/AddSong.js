import React from 'react'
import request from 'superagent'
import _ from 'lodash'

import Icon from '../Icon'
import PlaylistStore from '../stores/PlaylistStore.js'

export default class AddSong extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }

  }
  componentDidMount() {
    this._playlistStoreListener = PlaylistStore.listen(this._playlistDataUpdated)
    this._playlistDataUpdated(PlaylistStore.getUserPlaylists())
  }

  componentWillUnmount() {
    this._playlistStoreListener()
  }

  _uploadSong(){
    var icon = document.getElementById('add-song')
    if(!icon.classList.contains('active')){
      icon.classList.add('active')
      document.getElementById('add-song-input').focus()
      return 0
    }

    if(e.target.id == 'add-song-input'){
      return 0
    }

    var url = document.getElementById('add-song-input').value
    if(url == ''){
      icon.classList.remove('active')
      return 0
    }

    request.post('/uploadSong/' + 188)
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
