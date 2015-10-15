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
        {audio}
      </div>
    );
  }
}
