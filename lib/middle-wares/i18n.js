var _     = require('underscore')
  , i18n  = require('../i18n')
  , utils = require('../utils');

/**
 * 增加i18n 处理函数上去，因为 i18n 会根据用户来变化，所以需要每次请求都处理
 * 附加到 req 上，通过 req.i18n 来访问
 * 例如: req.i18n.t('Hello');
 */

module.exports = {
  name: 'i18n',
  action: function(opts) {
    return function(req, res, next) {
      req.i18n = i18n;
      next()
    }
  }
};
