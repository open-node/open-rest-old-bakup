var _   = require('underscore');

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

module.exports = {
  name: 'checkPriv',
  action: function(opts, req, res, next) {
    var roles = opts.method.roles;
    // 如果角色列表不为空，则需要判断权限
    // 角色列表为空，则任何人都可以访问
    if(roles.length > 0) {
      // 如果用户未登录则直接提示没有权限
      if(!req.user) {
        next(new Error('您没有权限执行该操作'));
      }

      // 如果用户所属的角色不在允许的角色列表内
      // 则继续判断
      if(roles.indexOf(req.user.role) < 0) {
        // 如果角色白名单里没有 __self、或则 没有当前model、或则当前model不属于 __self
        // 则提示用户没有权限
        if(roles.indexOf('__self') < 0 || !req.model || !req.model.__self) {
          next(new Error('您没有权限执行该操作'));
        }
      }
    }
    next();
  }
};
