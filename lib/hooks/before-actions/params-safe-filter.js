// 处理添加和编辑时不能操作的字段，
// 将其直接从req.params中剔除，避免用户提交修改或者添加一些只读的属性
// 比如用户不能修改自己的积分，不能修改自己的角色

module.exports = {
  name: 'paramsSafeFilter',
  action: function(opts, req, res, next) {
    // todo list params 的过滤处理
    // 权限控制的配置如下
    //role: {
    //  type: 'enum',
    //  values: ['admin', 'member'],
    //  defaultValue: 'member',
    //  /**
    //   * 权限控制，针对此字段的权限控制
    //   * key 是 action
    //   * value 是允许操作此字段的用户角色
    //   */
    //  priv: {
    //    modify: ['admin'],
    //    add: []
    //  }
    //},
    next();
  }
};
