var React = require('react')
let {PropTypes} = React
import request from 'superagent'

import Actions from '../RefluxActions'

export default class RemoveButton extends React.Component {
  constructor(props) {
    super(props)
  }


  _click(event) {
    console.log(this.props)
    request.post([
      '/removeSongFromPlaylist',
      this.props.song.id,
      this.props.playlist.id,
    ].join('/'))
    .end((error, result) => {
      if (error) {
        console.log(error)
        return
      }
      Actions.refreshPlaylist()
    })
  }

  render() {
    return (
      <div
        ref='button'
        className='remove circle remove-icon'
        onClick={this._click.bind(this)} >
      </div>
    )
  }
}

RemoveButton.defaultProps = {
  song: null,
  playlist: null,
}
RemoveButton.propTypes = {
  song: PropTypes.object,
  playlist: PropTypes.object,
}


