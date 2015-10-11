var pg = require('pg')

var db = null;
function query() {
  var args = [].slice.call(arguments);
  return new Promise(function(resolve, reject) {
    var cb = function(error, result) {
      if (error) {
        console.log('reject')
        reject(error);
      } else {
        resolve(result);
      }
    };
    args.push(cb);
    db.query.apply(db, args);
  });
};

function getDB() {
  return new Promise(function(resolve, reject) {
    pg.connect(process.env.PG_CONNECTION, function(error, client, done) {
      if (error) {
        reject()
      }
      db = client;
      resolve(client)
    })
  })
}


module.exports = {
  query: query,
  connect: getDB,
}