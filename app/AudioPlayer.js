var React = require('react')
var request = require('superagent');

var mediaRoot = '/media/'
export default class AudioPlayer extends React.Component {
  constructor() {
    super()

    this.state = {
      song: null
    }
  }

  componentDidMount() {
    this._getNextSong();
  }

  _getNextSong() {
    request.get('/currentSong')
      .end((error, result) => {
        this.setState({
          song: JSON.parse(result.text)
        })
      })
  }

  render(){
    var audio = null
    if (this.state.song !== null) {
      audio = <audio onEnded={this._getNextSong.bind(this)} autoPlay="autoplay" controls src={mediaRoot + this.state.song.path} />
    }
    return (
      <div>
        <div id="playhead">
            <div id="song">
              <span className="songname">
                Owner of a Funky Heart
              </span>
              <span className="artist">
                ChipStack
              </span>
              <div id="timestamp">
                3:06
              </div>
            </div>
            <div id="progress-container">
              <div id="progress-bar"></div>
            </div>
          </div>
        {audio}
      </div>
    );
  }
}
