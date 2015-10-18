var React = require('react')

export default function VolumeControl(props) {
  return (
    <div id="volume-container">
      <div id="volume-bar" style={{
        width: props.volume * 100 + '%'
      }}>
        <div id="volume-grabber"></div>
      </div>
    </div>
  )
}

