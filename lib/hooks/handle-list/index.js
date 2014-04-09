/**
 * list 接口返回结果的处理
 * resource: 资源的配置信息，具体参考 ../resources/*.js
 * req: 当前http请求的 request
 * res: 当前http请求的 res
 * next: 成功处理完成的执行函数
 * 输出的是一个数组，数组里每一项是一个object，形如:
 * {
 *   name: 'actionName',
 *   action: function({
 *     Model: Model,
 *     resource: resource,
 *     association: association
 *   }, req, list) {}
 * }
 * 需要注意钩子函数的执行顺序，有些是有依赖的，比如check-priv 需要依赖current-model
 */

module.exports = [
  require('./attributes-filter'),
];

