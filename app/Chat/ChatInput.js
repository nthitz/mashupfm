var React = require('react')

export default class ChatInput extends React.Component {
    constructor() {
      super()

      this.state = {
      }
    }

    componentDidMount() {

    }
    render(){

      return (
        <div>
          <input placeholder="type something" />
        </div>
      )
    }
}