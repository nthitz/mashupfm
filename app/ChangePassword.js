var React = require('react')

export default class ChangePassowrd extends React.Component {
  constructor() {
    super()

    this.state = {
    }
  }

  componentDidMount() {
    //fill hash from url

    //request username from hash
  }

  render(){
    return (
      <div>
        change password
        <form action="/changePassword" method="post">
          <div>
            <label>Hash:</label>
            <input
              type="text"
              name="hash"
              refs="hash" />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              refs="password" />
          </div>
          <div>
            <label>Again:</label>
            <input
              type="password"
              name="password_again"
              refs="password_again" />
          </div>

        </form>
      </div>
    );
  }
}
