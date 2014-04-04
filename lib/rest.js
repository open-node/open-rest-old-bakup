var _     = require("underscore")
  , utils = require("./utils")
  , Model = require("./model");

function Rest(resource, server, sequelize, opts) {
  this.opts       = opts;
  this.resource   = resource;
  this.server     = server;
  this.sequelize  = sequelize;
  this.initialize();
};

//扩充实例方法
_.extend(Rest.prototype, {

  initialize: function() {
    var _this = this
      , resource  = this.resource
      , sequelize = this.sequelize;

    // 根据resource的定义自动创建sequelize 的model类
    this.Model = utils.model(resource.name, resource, sequelize);
    this.Model.sync()

    // 循环注册方法到server上，用来监听客户端发起的请求
    _.each(this.resource.methods, function(method) {
      _this[method.method || method]();
    });
  },

  // 获取列表的方法
  list: function() {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('list', resource)
      , args
      , action = function(req, res, next) {
        var options = utils.findAllOpts(req.params, resource);
        Model.count({where: options.where}).success(function(total) {
          Model.findAll(options).success(function(list) {
            res.header("X-Content-Record-Total", total);
            res.send(200, list);
            next();
          });
        });
      };

    args = [this.collectionUri()].concat(beforeActions).concat(action);
    this.server.get.apply(this.server, args);
  },

  // 获取单个资源详情的方法
  detail: function() {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('detail', resource)
      , args
      , action = function(req, res, next) {
        Model.find(req.params.id).success(function(model) {
          if(model) {
            res.send(200, model);
          } else {
            res.send(404);
          }
          next();
        });
      };

    args = [this.detailUri()].concat(beforeActions).concat(action);
    this.server.get.apply(this.server, args);
  },

  // 修改某个资源描述的方法
  modify: function() {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('modify', resource)
      , args
      , action = function(req, res, next) {
        Model.find(req.params.id).success(function(model) {
          var errors;
          if(!model) {
            res.send(404);
            return next();
          }
          attr = utils.pickParams(req.params, resource);
          delete attr.id
          _.extend(model, attr);
          errors = model.validate()
          if(errors) {
            res.send(500, errors);
            return next();
          }
          model.save().success(function(mod) {
            res.send(200, mod);
            next();
          });
        });
      };

    args = [this.detailUri()].concat(beforeActions).concat(action);
    this.server.put.apply(this.server, args);
  },

  // 根据资源描述添加资源到集合上的方法
  add: function() {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('add', resource)
      , args
      , action = function(req, res, next) {
        var model
          , errors
          , attrs = utils.pickParams(req.params, resource);

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

    args = [this.detailUri()].concat(beforeActions).concat(action);
    this.server.post.apply(this.server, args);
  },

  // 删除某个资源
  remove: function() {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('remove', resource)
      , args
      , action = function(req, res, next) {
        Model.find(req.params.id).success(function(model) {
          if(!model) {
            res.send(404);
            return next();
          }
          model.destroy().success(function(mod) {
            res.send(204);
            next();
          });
        });
      };

    args = [this.detailUri()].concat(beforeActions).concat(action);
    this.server.del.apply(this.server, args);
  },

  // 返回beforeActions钩子函数,可以有多个
  beforeActions: function(action, resource) {
    var beforeActions = this.opts.hooks.beforeActions;
    return _.map(beforeActions, function(beforeAction) {
      return function(req, res, next) {
        beforeAction.action(action, resource, req, res, next);
      };
    });
  },

  // 获取资源集合uri地址
  collectionUri: function() {
    return this.resource.collectionUri || '/' + this.resource.name + 's';
  },

  //获取资源详情uri地址
  detailUri: function() {
    return this.resource.detailUri || '/' + this.resource.name + 's/:id';
  }

});

module.exports = Rest;
