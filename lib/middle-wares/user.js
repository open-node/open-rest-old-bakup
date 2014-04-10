var _     = require('underscore')
  , utils = require('../utils');

/**
 * 处理当前访问用户
 * 附加到 req 上，通过 req.user 来访问
 * 例如: req.user.name 当前访问者用户名
 */

module.exports = {
  name: 'user',
  action: function(opts) {
    return function(req, res, next) {
      var token = utils.getAccessToken(req)
        , User  = utils.model('user');
      if(!User) {
        return next();
      }
      if(!token) {
        req.user = null;
        return next();
      }
      User.find(1).success(function(user) {
        req.user = user;
        return next();
      });
    }
  }
};
