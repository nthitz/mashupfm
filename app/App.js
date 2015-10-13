var React = require('react')

var AudioPlayer = require('./AudioPlayer')
var LoginForm = require('./LoginForm')

export default class App extends React.Component {
    render(){
      return (
        <div>
          <AudioPlayer />
          <LoginForm />
        </div>
      )
    }
}
