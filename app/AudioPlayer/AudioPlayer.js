var React = require('react')
var request = require('superagent');
var RefluxActions = require('../RefluxActions')
var ProgressBar = require('./ProgressBar')

var mediaRoot = '/media/'

var interval = null
export default class AudioPlayer extends React.Component {
  constructor() {
    super()

    this.state = {
      song: null,
      duration: 0,
      currentTime: 0,
    }

    this._changeVolume = this._changeVolume.bind(this)
  }

  componentDidMount() {
    this._getNextSong();
    interval = setInterval(this._updatePlayhead.bind(this), 100)
    RefluxActions.changeVolume.listen(this._changeVolume)
  }

  componentWillUnmount() {
    clearInterval(interval)
    RefluxActions.changeVolume.unlisten(this._changeVolume)
  }

  _changeVolume(volume) {
    this.refs.audio.volume = volume
  }

  _getNextSong() {
    request.get('/currentSong')
      .end((error, result) => {
        this.setState({
          song: JSON.parse(result.text)
        })
      })
  }

  _updatePlayhead() {
    if (this.state.song === null) {
      return
    }
    this.setState({
      currentTime: this.refs.audio.currentTime,
      duration: this.refs.audio.duration,
      percent: this.refs.audio.currentTime / this.refs.audio.duration
    })
  }

  render(){
    if (this.state.song === null) {
      return (
        <div>
          No Song playing
        </div>
      )
    }

    var audio =
      <audio
        ref='audio'
        onEnded={this._getNextSong.bind(this)}
        autoPlay='autoplay'
        src={mediaRoot + this.state.song.path} />

    return (
      <div>
        <div id='playhead'>
          <div id='song'>
            <span className='songname'>
              {this.state.song.title}
            </span>
            <span className='artist'>
              {this.state.song.author}
            </span>
            <div id='timestamp'>
              {this._formatTime(this.state.currentTime)}
            </div>
          </div>
          <ProgressBar progress={this.state.percent} />
        </div>
        {audio}
      </div>
    );
  }

  _formatTime(time) {
    var minutes = ~~(time / 60)
    var seconds = ~~(time % 60)
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return minutes + ':' + seconds
  }
}
