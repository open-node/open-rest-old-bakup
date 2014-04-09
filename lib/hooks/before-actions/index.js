/**
 * 控制器action执行前的hook
 * action: String 控制器动作 list, detail, modify, add, remove
 * resource: 资源的配置信息，具体参考 ../resources/*.js
 * req: 当前http请求的 request
 * res: 当前http请求的 res
 * next: 成功处理完成的执行函数
 * 输出的是一个数组，数组里每一项是一个object，形如:
 * {
 *   name: 'actionName',
 *   action: function({
 *     action: {
 *       method: 'list',
 *       route: '/users'
 *       roles: ['__self', 'admin']
 *     },
 *     resource: resource,
 *     association: association
 *   } , req, res, next) {}
 * }
 * 需要注意钩子函数的执行顺序，有些是有依赖的，比如check-priv 需要依赖current-model
 */

module.exports = [
  require('./current-model'),
  require('./check-priv')
];

