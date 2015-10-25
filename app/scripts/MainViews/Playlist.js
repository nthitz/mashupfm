import React from 'react'
import request from 'superagent'

class Song extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <li className='song'>
        <div className='title'>
          {this.props.song.title}
        </div>
        <div className='artist'>
          {this.props.song.artist}
        </div>
        <div className='bottom'>
          <div className='preview'>
            preview
          </div>
          <div className='dj-container'>
            Queued by
            <span className='dj'>
               what is this
            </span>
          </div>
        </div>
        <div className='hover-controls'>
          <a className='download circle'>
            d
          </a>
          <div className='grab circle'>
            c
            <ul className='playlist-dropdown'>
              <li className='added'>
                Slams
              </li>
              <li className='added'>
                Extra slammy slams
              </li>
              <li>
                Friday earbleeds
              </li>
              <li>
                Bruneaux
              </li>
            </ul>
          </div>
        </div>
      </li>
    )
  }
}

export default class Playlist extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      songs: []
    }
  }

   componentDidMount() {
    if (this.props.playlist) {
      this._requestPlaylist(this.props.playlist.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playlist) {
      this._requestPlaylist(nextProps.playlist.id)
    }
  }

  _requestPlaylist(playlistId) {
    request.get('/getPlaylist/' + playlistId)
      .end((error, result) => {
        var playlist = JSON.parse(result.text)
        this.setState({
          songs: playlist.songs
        })
      })
  }

  render() {
    let songs = this.state.songs.map((song, songIndex) => {
      return <Song song={song} key={songIndex} />
    })
    return (
      <div id='playlist'>
        <ul>
          {songs}
        </ul>
      </div>
    )
  }

}
