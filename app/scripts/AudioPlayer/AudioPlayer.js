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
      seekTo: 0,
      duration: 0,
      currentTime: 0,
      playing: false,
    }
    this._firstPlay = true
    this._changeVolume = this._changeVolume.bind(this)
    this._requestPlay = this._requestPlay.bind(this)
    this._getNextSong = this._getNextSong.bind(this)
  }

  componentDidMount() {
    this._getNextSong();
    interval = setInterval(this._updatePlayhead.bind(this), 100)
    RefluxActions.changeVolume.listen(this._changeVolume)
    RefluxActions.newSong.listen(this._getNextSong)
  }

  componentWillUnmount() {
    clearInterval(interval)
    RefluxActions.changeVolume.unlisten(this._changeVolume)
    RefluxActions.newSong.unlisten(this._getNextSong)

  }

  _changeVolume(volume) {
    this.refs.audio.volume = volume
  }

  _getNextSong() {
    let query = {}
    if (this._firstPlay) {
      this._firstPlay = false
      query.seek = 'seek'
    }
    request.get('/currentSong')
      .query(query)
      .end((error, result) => {
        let data = JSON.parse(result.text)
        this.setState({
          song: data.song,
          seekTo: data.seek,
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
  _onPlaying() {
    if(localStorage.getItem('volume'))
      this.refs.audio.volume = Math.pow(localStorage.getItem('volume'), 2)
    if (this.state.seekTo !== 0) {
      this.setState({
        seekTo: 0
      })
      this.refs.audio.currentTime = this.state.seekTo / 1000
    }
    this.setState({
      playing: true,
    })
  }

  _requestPlay() {
    this.refs.audio.play()
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
        onPlaying={this._onPlaying.bind(this)}
        autoPlay='autoplay'
        src={mediaRoot + this.state.song.path} />

    var playButton = null

    if (!this.state.playing) {
      playButton = <input type="button"
        onClick={this._requestPlay}
        value="PLAY" />
    }


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
        {playButton}

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
