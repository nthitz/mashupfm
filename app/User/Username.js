var React = require('react')
import UserStore from '../stores/UserStore'

export default function Username (props) {
  var user = UserStore.getUserById(props.id)
  return (
    <div className='username'>
      {user.username}:
    </div>
  )
}
