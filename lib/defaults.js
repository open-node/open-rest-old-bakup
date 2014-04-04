module.exports = {
  // 定义 webserver 信息
  name: 'Standard REST service',
  version: 'unknow',
  port: 7788,

  // 定义数据库信息
  db: {},

  // 定义 中间件
  middleWares: [],

  // 定义钩子函数
  hooks: {},

  // 定义资源描述
  resources: [],

  /**
   * 系统功能开关
   * 开关默认为开启，若要关闭，需要显式申明为false
   */
  switchs: {
    // 中间件开关
    middleWares: {},

    // hook开关
    hooks: {
      // 控制器主体函数执行前的钩子
      beforeActions: {
        //系统自带处理当前用户信息的钩子
        user: true,
        //系统自带处理当前model信息的钩子
        model: true
      }
    }
  }
};
