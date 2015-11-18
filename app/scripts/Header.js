var React = require('react')
var request = require('superagent');

var AudioPlayer = require('./AudioPlayer/AudioPlayer')
var VoteButtons = require('./AudioPlayer/VoteButtons')
var VolumeControl = require('./AudioPlayer/VolumeControl')
var Avatar = require('./User/Avatar')
var userAuth = require('./userAuth')
import RefluxActions from './RefluxActions'

export default class Header extends React.Component {
  constructor() {
    super();

    this.state = {
      user: null,
      currentDJ: null
    }
    RefluxActions.setDJ.listen(this._setCurrentDJ.bind(this))
  }

  componentDidMount() {
    userAuth.getUser()
      .then((user) => {
        this.setState({
          user: user,
        })
      })

  }

  _setCurrentDJ(dj) {
    console.log('_setCurrentDJ', dj)
    this.setState({
      currentDJ: dj
    })
  }


  render(){
    let currentDJAvatar = null

    if (this.state.currentDJ) {
      currentDJAvatar = (
        <Avatar
          id='current-dj'
          userId={this.state.currentDJ.id} />
      )
    } else {
      currentDJAvatar = <Avatar id='current-dj' default={true} />
    }
    return (
      <div id='header-container'>
        <div id='header'>
          {currentDJAvatar}
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

