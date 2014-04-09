var _ = require('underscore');

/**
 * body 的解析
 */

module.exports = {
  name: 'body-parser',
  action: function(opts) {
    return function(req, res, next) {
      if(_.isString(req.body)) {
        try {
          req.body = JSON.parse(req.body);
          _.extend(req.params, req.body);
        } catch(e) {}
      }
      next()
    }
  }
};
