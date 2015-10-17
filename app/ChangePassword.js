var React = require('react')
var request = require('superagent');

let hash = null;
export default class ChangePassowrd extends React.Component {
  constructor() {
    super()

    this.state = {
      username: '',
      badPassword: false,
    }
  }

  componentDidMount() {
    hash = this.props.location.query.hash

    if (hash === undefined) {
      return
    }
    this._requestHash()
  }

  _requestHash() {
    request.get('/auth/getUsernameForPasswordHash')
      .query({
        hash: hash
      })
      .end((error, result) => {
        this.setState({
          username: JSON.parse(result.text).username
        })
      })
  }

  _submit(event) {
    console.log('submit')
    event.preventDefault()
    if (this.refs.password.value !== this.refs.password_again.value) {
      this.setState({
        badPassword: true
      })
      console.log('bad pass')
      return
    }
    this.setState({
      badPassword: false
    })

    request.post('/auth/changePassword')
      .send({
        hash: hash,
        username: this.refs.username.value,
        password: this.refs.password.value
      })
      .end((error, result) => {
        console.log(result)
        if (result.body.status === 'success') {
          document.location.href = '/'
        }
      })
  }

  render(){

    return (
      <div>
        change password
        <form action="/auth/changePassword" method="post">
          <div>
            <label>Username:</label>
            <input type="text"
              ref="username"
              value={this.state.username} />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              ref="password" />
          </div>
          <div>
            <label>Again:</label>
            <input
              type="password"
              ref="password_again"
              style={{
                backgroundColor: this.state.badPassword ? 'lightsalmon' : null
              }} />
          </div>
          <input type="submit"
            onClick={this._submit.bind(this)}
            />
        </form>
      </div>
    );
  }
}
