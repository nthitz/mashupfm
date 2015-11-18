/* 8======D ~~~~ M A S H U P   K I N G ~~~~ (====8 */
var React = require('react')
var request = require('superagent');
var RefluxActions = require('../RefluxActions')

export default class VoteButtons extends React.Component {
  constructor(props) {
    super(props)

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

    console.log('Testing to see if I can acces this function, which would ideally replace the code above')
    console.log(RefluxActions.getUserPlaylists())
    console.log('end call')
    console.log('CDM - VoteButtons')
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

