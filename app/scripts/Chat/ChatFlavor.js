var Encoder = require('node-html-encoder').Encoder

var chat = {
    spice: function(message){
        chat.message = message.trim().split(' ')
        chat.message = chat.message.map(chat.spiceElement)
        console.log(chat.splitEntities(message))
        return chat.message.join(' ')
    },

    splitEntities: function(message){
        var split = message.split(chat.urlRegex)
        return split.map(function(e){
            if(e == undefined)
                return null
            if(e.match(chat.urlRegex)){
                var protocolRegex = /^https?:\/\//
                var url = null
                if(protocolRegex.test(e))
                    url = e
                else
                    url = 'http://' + e

                var imgRegex = /\.(?:jpe?g|gif|png)$/
                if(imgRegex.test(e)){
                    return {type: 'image', url: url}
                }
                return {type: 'link', content: e, href: url}
            }

            return {type: 'plain', content: e}
        }).filter(function(e){return e})
    },
    
    //taken from http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
    urlRegex: new RegExp(/([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/gi),

    splitComponents: [],

    encoder: new Encoder('entity'),
    
    spiceElement: function(e){
        e = chat.addURLs(e)
        e = chat.expandImages(e)
        return e
    },

    message: [],

    addURLs: function(e){
        if(e.match(chat.urlRegex))
            return e.replace(chat.urlRegex, chat.convertToLink)

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
  spice: chat.spice,
  splitEntities: chat.splitEntities
}
