var _ = require('underscore');

/**
 * 删除掉一些不安全的属性
 */

module.exports = {
  name: 'attributes-filter',
  action: function(opts, req, list) {
    return list;
  }
};
