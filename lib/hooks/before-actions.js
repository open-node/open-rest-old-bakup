var _ = require("underscore");

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
 *   action: function(action, resource, req, res, next) {}
 * }
 */
module.exports = [{
  name: 'checkPriv',
  action: function(action, resource, req, res, next) {

    // 权限判断，判断当前用户是否有权限执行该操作
    // 没有权限则
    // return cb(new Error('没有权限操作'));

    // todo list 权限处理
    /**
      methods: [{
        method: 'list',
        roles: ['admin']
      }, {
        method: 'detail',
      }, {
        method: 'add',
      }, {
        method: 'modify',
        roles: ['__self', 'admin']
      }, {
        method: 'remove',
        roles: ['admin']
      }]
    */
    method = _.find(resource.methods, function(x) {
      return (x.method || x) === action;
    });
    if(method.roles) {
      if(!req.user) {
        return res.send(403, new Error('您没有权限执行该操作'));
      }
      if(method.roles.indexOf(req.user.role) < 0) {
        return res.send(403, new Error('您没有权限执行该操作'));
      }
    }
    next();
  }
}, {
  // 处理添加和编辑时不能操作的字段，
  // 将其直接从req.params中剔除，避免用户提交修改或者添加一些只读的属性
  // 比如用户不能修改自己的积分，不能修改自己的角色
  // todo list params 的过滤处理
  name: 'paramsSafeFilter',
  action: function(action, resource, req, res, next) {
    next();
  }
}];

