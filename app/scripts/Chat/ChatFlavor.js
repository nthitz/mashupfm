var Encoder = require('node-html-encoder').Encoder

var chat = {
    spice: function(message){
        chat.message = message.trim().split(' ')
        chat.message = chat.message.map(chat.spiceElement)
        return chat.message.join(' ')
    },

    encoder: new Encoder('entity'),
    
    spiceElement: function(e){
        e = chat.addURLs(e)
        e = chat.expandImages(e)
        return e
    },

    message: [],

    addURLs: function(e){
        //taken from http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        var expression = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/gi
        var regex = new RegExp(expression)

        if(e.match(regex))
            return e.replace(regex, chat.convertToLink)

        return chat.encoder.htmlEncode(e)
    },

    convertToLink: function(match){
        if(match.indexOf('http') == 0 || match.indexOf('//') == 0)
            return "<a href='" + match + "'>" + match + "</a>"
        else
            return "<a href='http://" + match + "'>" + match + "</a>"
    },

    expandImages: function(e){
        //todo
        return e
    },
}

module.exports = {
  spice: chat.spice
}
