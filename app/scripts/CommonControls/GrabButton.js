var React = require('react')
let {PropTypes} = React

import SongStore from '../stores/SongStore'
import Actions from '../RefluxActions'

export default class GrabButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }

    this._deactivate = this._deactivate.bind(this)
  }

  componentDidMount() {
    this.unlisten = Actions.closeGrabDropdown.listen(this._deactivate)
  }

  componentWillUnmount() {
    this.unlisten()
  }

  _click(event) {
    this.setState({
      active: !this.state.active
    })
    let song = this.props.song
    if (song == null) {
      song = SongStore.getSong()
    }
    Actions.grabDropdown(this.refs.button, !this.state.active, song)
  }

  _deactivate() {
    this.setState({
      active: false
    })
  }


  render() {
    return (
        <div
          ref='button'
          className={`grab circle grab-icon ${this.state.active ? 'active' : ''}`}
          id='grab'
          onClick={this._click.bind(this)} >
        </div>
    )
  }
}
GrabButton.defaultProps = {
  song: null
}
GrabButton.propTypes = {
  song: PropTypes.object,
}

