var _   = require("underscore")
  , fs  = require("fs");

module.exports = {
  name: 'Standard REST example users',
  version: '0.0.1',
  port: 7788,
  db: {
    name: 'example_user',
    user: 'root',
    pass: '123457',
    dialect: 'mysql',
    define: {
      engine: 'MYISAM'
    }
  },
  resources: (function() {
    var path = __dirname + '/resources';
    return _.map(fs.readdirSync(path), function(file) {
      return require('./resources/' + file);
    });
  })()
};
