var React = require('react')
var request = require('superagent');
var AudioPlayer = require('./AudioPlayer/AudioPlayer')
var VoteButtons = require('./AudioPlayer/VoteButtons')
var VolumeControl = require('./AudioPlayer/VolumeControl')

var userAuth = require('./userAuth')

export default class Header extends React.Component {
  constructor() {
    super();

    this.state = {
      user: null
    }
  }

  componentDidMount() {
    userAuth.getUser()
      .then((user) => {
        this.setState({
          user: user,
        })
      })
  }


  render(){
    return (
      <div id='header-container'>
        <div id='header'>
          <div className='avatar' id='current-dj'></div>

          <AudioPlayer />

          <div id='controls'>
            <VoteButtons />

            <div id='user-controls'>
              <div id='username'>
                {this.state.user === null ? '' : this.state.user.username}
              </div>
              <div id='log-controls'>
                log out
              </div>
            </div>
            <VolumeControl defaultVolume={1} />
          </div>
        </div>
      </div>
    );
  }
}

