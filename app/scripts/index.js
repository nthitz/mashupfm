var React = require('react')
var ReactDOM = require('react-dom');
import { Router, Route, Link } from 'react-router'

var App = require('./App')
var ChangePassword = require('./ChangePassword')

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
      <Route path="changePassword" component={ChangePassword} />
    </Route>
  </Router>
), document.getElementById('app'))
