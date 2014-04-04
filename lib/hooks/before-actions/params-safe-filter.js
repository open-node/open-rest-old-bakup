// 处理添加和编辑时不能操作的字段，
// 将其直接从req.params中剔除，避免用户提交修改或者添加一些只读的属性
// 比如用户不能修改自己的积分，不能修改自己的角色
// todo list params 的过滤处理

module.exports = {
  name: 'paramsSafeFilter',
  action: function(action, resource, req, res, next) {
    next();
  }
};
