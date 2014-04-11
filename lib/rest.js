var _         = require("underscore")
  , utils     = require("./utils")
  , apis      = [];

function Rest(resource, server, sequelize, opts) {
  this.opts       = opts;
  this.resource   = resource;
  this.server     = server;
  this.sequelize  = sequelize;
  this.initialize();
};

Rest.apis = function(server, route) {
  server.get(route, function(req, res, next) {
    res.send(200, apis);
    next();
  });
};

//扩充实例方法
_.extend(Rest.prototype, {

  initialize: function() {
    var _this = this
      , resource  = this.resource
      , sequelize = this.sequelize;

    // 获取Model
    this.Model = utils.model(resource.name);

    // 循环注册方法到server上，用来监听客户端发起的请求
    _.each(this.resource.methods, function(item) {
      _this.createApi(item, null);
    });

    // 处理关联资源的接口
    _.each(this.resource.associations, function(association) {
      _.each(association.methods, function(item) {
        _this.createApi(item, association);
      });
    });

  },

  // 对外提供接口的统一处理
  createApi: function(item, association) {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions(item, resource, association)
      , map = {
        list: 'get',
        detail: 'get',
        modify: 'put',
        add: 'post',
        remove: 'del'
      }
      , args
      , action = this[item.method](Model, resource, association, item);

    args = [item.route].concat(beforeActions).concat(action);
    this.server[map[item.method]].apply(this.server, args);

    // 记录接口信息，供给apis来返回目前提供的apis
    apis.push({
      verb: item.method === 'remove' ? 'delete' : map[item.method],
      path: item.route,
      roles: item.roles
    });
  },

  // 获取列表的方法
  // method 是后来加入的对应的是 options 里 methods 里的某一项
  list: function(Model, resource, association, method) {
    var recordTotalHeaderName = this.opts.constant.recordTotalHeaderName;
    return function(req, res, next) {
      var options = utils.findAllOpts(req.params, resource, association, method);
      Model.count({where: options.where}).success(function(total) {
        Model.findAll(options).success(function(list) {
          res.header(recordTotalHeaderName, total);
          res.send(200, list);
          next();
        });
      });
    };
  },

  // 获取单个资源详情的方法
  detail: function(Model, resource, association) {
    return function(req, res, next) {
      res.send(200, req.model);
    };
  },

  // 修改某个资源描述的方法
  modify: function(Model, resource, association) {
    var resource = this.resource;
    return function(req, res, next) {
      var errors;
      attr = utils.pickParams('modify', req, resource, association);
      delete attr.id
      _.extend(req.model, attr);
      errors = req.model.validate()
      if(errors) {
        res.send(500, errors);
        return next();
      }
      req.model.save().success(function(mod) {
        res.send(200, mod);
        next();
      });
    };
  },

  // 根据资源描述添加资源到集合上的方法
  add: function(Model, resource, association) {
    var resource  = this.resource;
    return function(req, res, next) {
      var model
        , errors
        , attrs = utils.pickParams('add', req, resource, association);

      delete attrs.id
      model = Model.build(attrs)
      errors = model.validate();
      if(errors) {
        res.send(500, errors);
        return next();
      }
      model.save().success(function(mod) {
        res.send(201, mod);
        next();
      });
    };
  },

  // 删除某个资源
  remove: function(Model, resource, association) {
    return function(req, res, next) {
      req.model.destroy().success(function(mod) {
        res.send(204);
        next();
      });
    };
  },

  // 返回beforeActions钩子函数,可以有多个
  beforeActions: function(method, resource, association) {
    var fns   = this.opts.hooks.beforeActions
      , opts  = {method: method, resource: resource, association: association};
    return _.map(fns, function(fn) {
      return function(req, res, next) {
        fn.action(opts, req, res, next);
      };
    });
  }

});

module.exports = Rest;
