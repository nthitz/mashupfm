import React from 'react'
import request from 'superagent'
import SortableMixin from '../mixins/react-sortable-mixin'

var mediaRoot = '/media/'

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
          {this.props.song.author}
        </div>
        <div className='bottom'>
          <a className='preview' target='_blank' href={mediaRoot + this.props.song.path}>
            preview
          </a>
          <div className='dj-container'>
            Queued by
            <span className='dj'>
               {this.props.song.id}
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

export default React.createClass({
  mixins: [SortableMixin],
  getInitialState: function() {
    return {
      songs: []
    }
  },
  sortableOptions: {
    ref: 'songs',
    model: 'songs',
    onStart: function() {
      console.log('on start')
    }
  },
  handleSort: function(event) {
    let order = this.state.songs.map((song) => { return song.id })
    request.post(`/updatePlaylistSort/${this.props.playlist.id}`)
      .send({order: order})
      .end((error, result) => {
        if (error) {
          throw error;
        }
      })
  },
  componentDidMount: function() {
    if (this.props.playlist) {
      this._requestPlaylist(this.props.playlist.id)
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.playlist) {
      this._requestPlaylist(nextProps.playlist.id)
    }
  },

  _requestPlaylist: function (playlistId) {
    request.get('/getPlaylist/' + playlistId)
      .end((error, result) => {
        var playlist = JSON.parse(result.text)
        let songs = playlist.songs
        let order = playlist.sort
        _.each(songs, (song) => {
          let songOrder = order.indexOf(song.id)
          if (songOrder === -1) {
            songOrder = 100000
          }
          song.order = songOrder
        })
        songs = _.sortBy(songs, 'order')
        let ids = songs.map((song) => { return song.id }).join(',')
        this.setState({
          songs: songs
        })
      })
  },

  render: function() {
    let songs = this.state.songs.map((song, songIndex) => {
      return <Song song={song} key={songIndex} />
    })
    return (
      <div id='playlist'>
        <ul ref='songs'>
          {songs}
        </ul>
      </div>
    )
  }
})

// export default class Playlist extends React.Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       songs: []
//     }
//   }

//    componentDidMount() {
//     if (this.props.playlist) {
//       this._requestPlaylist(this.props.playlist.id)
//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.playlist) {
//       this._requestPlaylist(nextProps.playlist.id)
//     }
//   }

//   _requestPlaylist(playlistId) {
//     request.get('/getPlaylist/' + playlistId)
//       .end((error, result) => {
//         var playlist = JSON.parse(result.text)
//         this.setState({
//           songs: playlist.songs
//         })
//       })
//   }

//   render() {
//     let songs = this.state.songs.map((song, songIndex) => {
//       return <Song song={song} key={songIndex} />
//     })
//     return (
//       <div id='playlist'>
//         <ul>
//           {songs}
//         </ul>
//       </div>
//     )
//   }

// }
