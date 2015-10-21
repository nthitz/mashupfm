var React = require('react')
import UserStore from '../stores/UserStore'

export default function Username (props) {
  var user = UserStore.getUserById(props.id)
  console.log(props)
  console.log(user)
  return (
    <div className='username'>
      {user.username}:
    </div>
  )
}
