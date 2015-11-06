var React = require('react')
var request = require('superagent');

export default class VoteButtons extends React.Component {
  constructor(props) {
    super(props)

    console.log(props)
    this.state = {
      playlists: []
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

        this.setState(newState)
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
    return (
      <div>
        <div className="circle upvote-icon" id="upvote">
        </div>
        <div className="grab circle grab-icon" id="grab">
          <ul className="playlist-dropdown">
            {playlistGrabList}
          </ul>
        </div>
        <div className="circle downvote-icon" id="downvote">
        </div>
      </div>
    )
  }
}

