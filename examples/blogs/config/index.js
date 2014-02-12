var _   = require("underscore")
  , fs  = require("fs");

module.exports = {

  // 定义 webserver 信息
  name: 'Standard REST example users',
  version: '0.0.1',
  port: 7788,

  // 定义 oauth 信息
  oauth: require('./oauth'),

  // 定义数据库信息
  db: require('./db'),

  // 定义资源描述
  resources: (function() {
    var path = __dirname + '/resources';
    return _.map(fs.readdirSync(path), function(file) {
      return require('./resources/' + file);
    });
  })()

};
