/**
 * 控制器action执行前的hook
 * action: String 控制器动作 list, detail, modify, add, remove
 * resource: 资源的配置信息，具体参考 ../resources/*.js
 * req: 当前http请求的 request
 * res: 当前http请求的 res
 * cb: 处理完成的回调函数
 */
module.exports = function(action, resource, req, res, cb) {
  console.log("BeforeAction(resource: " + resource.name + ") and (action: " + action + ")");
  cb();
};
