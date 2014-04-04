/**
 * 中间件，每次请求都会执行
 * 输出格式为数组格式，每一项是个object，形如
 * {
 *   name: 'middle-ware name',
 *   action: function(req, res, next) {}
 * }
 */

module.exports = [
  require('./i18n'),
  require('./user')
];
