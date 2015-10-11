var React = require('react')

var AudioPlayer = require('./AudioPlayer')

export default class App extends React.Component {
    render(){
      return (
        <div>
          <AudioPlayer />
        </div>
      )
    }
}
