var React = require('react')
var request = require('superagent');
import { Link } from 'react-router'

var action = "/login";
export default class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null,
      password: null,
      submitting: false,
    }
  }

  _changeStateProperty(property) {
    return function(value) {
      var stateUpdate = {};
      stateUpdate[property] = value.target.value
      this.setState(stateUpdate)
    }.bind(this);
  }

  _onSubmit(event) {
    if (this.state.submitting) {
      return
    }
    this.setState({submitting: true})
    request.post(action)
      .send({
        username: this.state.username,
        password: this.state.password,
      })
      .end((error, result) => {
        this.setState({ submitting: false })
        if (error && result.statusCode === 401) {
          alert('invalid login probably')
        } else if (error) {
          alert('something went wrong - ' + error)
          return;
        }

        if (result.body.status === 'success') {
          window.document.location.reload()
          return
        }
        alert('something went wrong - ' + result.body.text)
      })

    event.preventDefault()
  }

  render(){
    return (
      <div>
        <form ref='form' action={action} method="post">
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              onChange={this._changeStateProperty('username').bind(this)} />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              onChange={this._changeStateProperty('password').bind(this)} />
          </div>
          <div>
            <input
              type="submit"
              onClick={this._onSubmit.bind(this)}
              value="Log In" />
          </div>
        </form>
      </div>
    );
  }
}

