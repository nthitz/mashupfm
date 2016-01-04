var React = require('react')

import PlaylistStore from '../stores/PlaylistStore.js'
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
    Actions.closeGrabDropdown.listen(this._deactivate)
  }

  componentWillUnmount() {
    Actions.closeGrabDropdown.unlisten(this._deactivate)
  }

  _click(event) {
    this.setState({
      active: !this.state.active
    })
    Actions.grabDropdown(this.refs.button, !this.state.active)
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

