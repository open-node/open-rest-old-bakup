var _     = require('underscore')
  , utils = require('../utils');

module.exports = {
  name: 'user',
  action: function(opts) {
    return function(req, res, next) {
      var token = utils.getAccessToken(req)
        , User  = utils.model('user');
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
