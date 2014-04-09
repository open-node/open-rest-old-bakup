var Sequelize = require("sequelize")
  , _         = require("underscore")
  , Model     = require("./model")
  , Resource  = require("./resource")
  , models      = {};

var utils = {

  /**
   * 合并系统自带的 功能模块和用户自定义的，并且过滤掉已关闭的
   * 例如 middleWares、hooks
   */
  mergeFns: function(syses, customs, switchs) {
    return _.filter((syses || []).concat(customs || []), function(fn) {
      return switchs[fn.name] !== false;
    });
  },

  /**
   * 创建并返回一个sequelize 的model类
   */
  model: function(name, resource, sequelize) {
    if(!models[name]) {
      models[name] = new Model(resource, sequelize);
    }
    return models[name];
  },

  /**
   * 构建所有的model，以及他们之间的关系
   */
  initModels: function(resources, sequelize) {
    // 根据resources 中每一个资源的定义自动创建sequelize 的model类
    _.each(resources, function(resource) {
      utils.model(resource.name, resource, sequelize);
    });

    // 处理resources
    resources = _.map(resources, function(resource) {
      resource = new Resource(resource, models);
      return resource;
    });

    // 根据resources 定义的关系，创建关系
    _.each(resources, function(resource) {
      var Model = utils.model(resource.name);
      _.each(resource.associations, function(item) {
        var OtherModel = utils.model(item.model);
        Model[item.method](OtherModel, item.opts);
      });
    });


    // 创建每一个表
    _.each(resources, function(resource) {
      var Model = utils.model(resource.name);
      Model.sync();
    });
  },

  /**
   * 基于Sequelize 初始化Sequelize 实例
   */
  initDB: function(opt) {
    return new Sequelize(opt.name, opt.user, opt.pass, opt);
  },

  /**
   * 返回全部资源的查询条件options
   */
  findAllOpts: function(params, resource, association) {
    return _.extend({
      where: (function() {
        var foreignKey
          , where = {};
        if(association) {
          foreignKey = association.opts.foreignKey;
          if(foreignKey) {
            where[foreignKey] = +params[foreignKey];
          }
        }
        return where;
      })()
    }, resource.associations.findOpts);
  },

  /**
   * 获取access_token
   * 需要兼容各种情况
   */
  getAccessToken: function(req) {
    return req.params.access_token || req.params.accessToken;
  },

  /**
   * 从 req 中提取所需的参数
   * arguments
   *  action: 'add', 'modify'
   *  req: http request
   *  resource: 资源的描述
   *  association: 资源的关系
   */
  pickParams: function(action, req, resource, association) {
    var attrs = []
      , writebleAttrs = resource.writebleAttrs
      , res;

    if(req.model.__self) {
      attrs = writebleAttrs.__self;
    }

    if(req.user) {
      attrs = attrs.concat(writebleAttrs[req.user.role]);
    }

    res = _.pick(req.params, _.uniq(attrs));

    if(resource.self && !res[resource.self]) {
      res[resource.self] = req.user.id;
    }
    return res;
  },

  /**
   * 字符串首字母大写
   */
  ucword: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1)
  }

};

module.exports = utils;
