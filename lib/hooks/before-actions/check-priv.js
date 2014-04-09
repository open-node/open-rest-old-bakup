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
    if(roles) {
      if(!req.user) {
        return res.send(403, new Error('您没有权限执行该操作'));
      }
      if(roles.length > 0 && roles.indexOf(req.user.role) < 0) {
        return res.send(403, new Error('您没有权限执行该操作'));
      }
    }
    next();
  }
};
