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
      confirm: null,
      submitting: false,
      registering: false,
      error: null,
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
    if (event) {
      event.preventDefault()
    }

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
          return
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

  }

  _onRegisterSubmit(event) {
    event.preventDefault()
    if (!this.state.registering) {
      this.setState({
        registering: true,
      })
      return
    }

    if (this.state.password.length < 6) {
      return this.setState({
        error: 'please make your password at least 6 characters'
      })
    }

    if (this.state.password !== this.state.confirm) {
      return this.setState({
        error: 'passwords don\'t match'
      })
    }

    request.post('/register')
      .send({
        username: this.state.username,
        password: this.state.password,
      }).end((error, result) => {
        if (error) {
          throw error
        }
        console.log(result)
        result = JSON.parse(result.text)
        if (result.status === 'error') {
          return this.setState({
            error: result.error
          })
        } else if (result.status === 'success') {
          this._onSubmit()
        }
      })
  }

  render(){
    let loginButton = (
      <input
        type="submit"
        onClick={this._onSubmit.bind(this)}
        value="Log In" />
    )
    let registerButton = (
      <input
        type="submit"
        onClick={this._onRegisterSubmit.bind(this)}
        value="Register" />
    )

    let confirmPasswordInput = null
    if (this.state.registering) {
      confirmPasswordInput = (
        <div>
          <label>Confirm password:</label>
          <input
            type="password"
            name="confirm"
            onChange={this._changeStateProperty('confirm').bind(this)} />
        </div>
      )
    }

    let error = null
    if (this.state.error) {
      error = (
        <div className='error'>{this.state.error}</div>
      )
    }

    return (
      <div>
        <form ref='form' action={action} method="post">
          {error}
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
          {confirmPasswordInput}
          <div>
            {loginButton}
            {registerButton}
          </div>
        </form>
      </div>
    );
  }
}

