module.exports = {
  // 定义 webserver 信息
  basics: {
    name: 'Standard REST service',
    version: 'unknow',
    port: 7788
  },

  // 定义一些常量
  constant: {
    // 钩子名称列表
    hookNameList: ['beforeActions'],

    // 列表接口返回总条目数的头部信息名称
    recordTotalHeaderName: 'X-Content-Record-Total',
  },

  // 列表方法的一些默认设置
  list: {
    // 分页默认参数
    pagination: {
      maxResults: 50,
      defaultResults: 20,
      maxResultsLimit: 100,
      maxStartIndex: 5000
    },

    // 列表排序的默认参数
    sort: {
      default: [],
      allow: ['id']
    },

    // 过滤条件的设置
    filter: []
  },

  // resource 的默认属性或者方法在这里
  resource: {
    model2json: function(res, model, resource) {
      console.log(res);
      return res;
    }
  },

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
        checkPriv: true,
        //系统自带处理当前model信息的钩子
        currentModel: true
      },
      // 过滤列表结果的钩子
      handleList: {
        attributes: false
      },
    }
  }
};
