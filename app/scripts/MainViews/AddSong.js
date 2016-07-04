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
        if(result.statusCode == 200){
          document.getElementById('add-song').classList.add('complete')
          document.getElementById('add-song-input').blur()
          document.getElementById('add-song-input').value = ''

          setTimeout(function(){
            document.getElementById('add-song').classList.remove('complete', 'active')
          }, 300)
          console.log(result)
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
