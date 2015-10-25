var React = require('react')
var {PropTypes} = React

export default function ProgressBar(props) {
  return (
    <div id='progress-container'>
      <div id='progress-bar' style={{
        width: props.progress * 100 +'%'
      }}></div>
    </div>
  );
}
ProgressBar.defaultProps = {
  progress: 0,
}
ProgressBar.propTypes = {
  progress: PropTypes.number,
}
