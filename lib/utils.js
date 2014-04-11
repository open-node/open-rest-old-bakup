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
  mergeFns: function(fns1, fns2, switchs) {
    return _.filter((fns1 || []).concat(fns2 || []), function(fn) {
      return switchs[fn.name] !== false;
    });
  },

  /**
   * 深度 clone 一个对象
   * arguments
   *   obj: 要clone的对象
   *   without: 过滤函数, 此函数接收的参数是 value, key.当返回true是排除此项的copy
   *   list: 记录clone过的对象，避免闭环导致的内存泄漏
   */
  clone: function(obj, withoutFn, list) {
    var res, has;
    if(_.isObject(obj)) {
      if(_.isRegExp(obj)) {
        return obj;
      }
      if(_.isArray(obj)) {
        res = []
      } else {
        res = {};
      }
      if(has = _.find(list, function(item) { return item[0] === obj;})) {
        return has[1];
      }
      _.each(obj, function(value, key) {
        if(!withoutFn || !withoutFn(value, key)) {
          res[key] = utils.clone(value, withoutFn, list);
          list.push([value, res[key]]);
        }
      });
      return res;
    } else {
      return obj;
    }
  },

  /**
   * 创建并返回一个sequelize 的model类
   */
  model: function(name, resource, sequelize) {
    if(!models[name] && resource && sequelize) {
      models[name] = new Model(resource, sequelize);
    }
    return models[name];
  },

  /**
   * 构建所有的model，以及他们之间的关系
   */
  initModels: function(resources, sequelize, opts) {
    // 根据resources 中每一个资源的定义自动创建sequelize 的model类
    _.each(resources, function(resource) {
      utils.model(resource.name, resource, sequelize);
    });

    // 处理resources
    resources = _.map(resources, function(resource) {
      resource = new Resource(resource, models, opts);
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
  findAllOpts: function(params, resource, association, method) {
    return _.extend(
      {
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
      }
      , utils.pageParams(params, method.pagination)
      , resource.associations.findOpts
    );
  },

  /**
   * 处理分页参数
   * 返回 {
   *   limit: xxx,
   *   offset: xxx
   * }
   */
  pageParams: function(params, pagination) {
    var startIndex = (+params.startIndex || 0)
      , maxResults = (+params.maxResults || +pagination.maxResults);
    return {
      limit: Math.min(maxResults, pagination.maxResultsLimit),
      offset: Math.min(startIndex, pagination.maxStartIndex)
    }
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

    if(req.model.__self === true) {
      attrs = writebleAttrs.__self;
    }

    if(req.user) {
      attrs = attrs.concat(writebleAttrs[req.user.role]);
    }

    res = _.pick(_.extend(req.params, req.body), _.uniq(attrs));

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
