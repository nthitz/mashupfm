var React = require('react')
var request = require('superagent');
var AudioPlayer = require('./AudioPlayer')

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
          <div className="circle" id="upvote">
            a
          </div>
          <div className="grab circle" id="grab">
            b
            <ul className="playlist-dropdown">
              <li className="added">
                Slams
              </li>
              <li className="added">
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
          <div className="circle" id="downvote">
            d
          </div>
          <div id="user-controls">
            <div id="username">
              wallpind
            </div>
            <div id="log-controls">
              log out
            </div>
          </div>
          <div id="volume-container">
            <div id="volume-bar">
              <div id="volume-grabber"></div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

