var React = require('react')
var request = require('superagent');
var AudioPlayer = require('./AudioPlayer/AudioPlayer')
var VoteButtons = require('./AudioPlayer/VoteButtons')
var VolumeControl = require('./AudioPlayer/VolumeControl')

export default class Header extends React.Component {
  constructor() {
    super();

    this.state = {
    }
  }


  render(){
    return (
      <div>
       <div id="header">
        <div className="avatar" id="current-dj"></div>

        <AudioPlayer />

        <div id="controls">
          <VoteButtons />

          <div id="user-controls">
            <div id="username">
              wallpind
            </div>
            <div id="log-controls">
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

