import React from 'react'
import request from 'superagent'
import _ from 'lodash'

import Icon from '../Icon'

export default class AddSong extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }

  }
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  _uploadSong(){
    console.log('hio')
    request.post('/uploadSong/' + 5)
      .set('Content-Type', 'application/json')
      .send('{"url":"asdf; ls"}')
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
