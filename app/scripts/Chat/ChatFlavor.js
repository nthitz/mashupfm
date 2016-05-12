import React from 'react'

let urlRegex = new RegExp(/(([-a-zA-Z0-9@:%_\+~#?&\/=][.]*){1,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?)/gi)
let protocolRegex = /^https?:\/\//
let imgRegex = /\.(?:jpe?g|gif|png)$/

function splitEntities(message) {
  let messagePieces = message.split(' ')
  return messagePieces.map((entity, index) => {
    if(!entity || entity === '' || entity === ' ') {
      return null
    }
    if(entity.match(urlRegex)){
      var url = null
      if(protocolRegex.test(entity)) {
        url = entity
      } else {
        url = 'http://' + entity
      }
      if(imgRegex.test(entity)){
        return (
          <img style={{width: '100%'}} key={`img-${index}`} src={url} />
        )
      }
      return (
        <a key={`link-${index}`} href={url} target='_blank'>{entity} </a>
      )
    }

    return (
      <span key={`text-${index}`}>{entity} </span>
    )
  })
}

function spice(message) {
  return splitEntities(message)
}

module.exports = {
  spice: spice,
}
