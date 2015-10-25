var request = require('superagent')

var user = null
function getUser() {
  if (user !== null) {
    return Promise.resolve(user)
  }
  return new Promise((resolve, reject) => {
    request.get('/user')
      .end((error, result) => {
        if (error) {
          reject(error)
          return
        }
        user = JSON.parse(result.text)
        resolve(user)
      })
  })
}

module.exports = {
  getUser: getUser
}