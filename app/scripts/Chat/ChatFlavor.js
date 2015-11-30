var chat = {
    spice: function(message){
        chat.message = message.trim().split(' ')
        console.log(chat.message)
        console.log(chat.message.map(chat.spiceElement))
        chat.message = chat.message.map(chat.spiceElement)
        return chat.message.join(' ')
    },
    
    spiceElement: function(e){
        e = chat.addURLs(e)
        e = chat.expandImages(e)
        return e
    },

    message: [],

    addURLs: function(e){
        //taken from http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
        var regex = new RegExp(expression)
        console.log('regex match: ' + e.match(regex))

        if(e.match(regex))
            return '<a href="' + e + '">' + e + '</a>'

        return e + ' booogies'
    },

    expandImages: function(e){
        return e
    },
}

module.exports = {
  spice: chat.spice
}
