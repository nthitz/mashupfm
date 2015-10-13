var React = require('react')
var request = require('superagent');

export default class LoginForm extends React.Component {


  render(){
    return (
      <form action="/login" method="post">
        <div>
            <label>Username:</label>
            <input type="text" name="username"/>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password"/>
        </div>
        <div>
            <input type="submit" value="Log In"/>
        </div>
    </form>
    );
  }
}

