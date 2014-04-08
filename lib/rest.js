var _         = require("underscore")
  , utils     = require("./utils");

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

    // 获取Model
    this.Model = utils.model(resource.name);

    // 循环注册方法到server上，用来监听客户端发起的请求
    _.each(this.resource.methods, function(item) {
      _this[item.method](item);
    });
  },

  // 获取列表的方法
  list: function(item) {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('list', resource)
      , args
      , action = function(req, res, next) {
        var options = utils.findAllOpts(req.params, resource);
        Model.count({where: options.where}).success(function(total) {
          Model.findAll(options).success(function(list) {
            res.header(opts.recordTotalHeaderName, total);
            res.send(200, list);
            next();
          });
        });
      };

    args = [item.route].concat(beforeActions).concat(action);
    this.server.get.apply(this.server, args);
  },

  // 获取单个资源详情的方法
  detail: function(item) {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('detail', resource)
      , args
      , action = function(req, res, next) {
         res.send(200, req.model);
      };

    args = [item.route].concat(beforeActions).concat(action);
    this.server.get.apply(this.server, args);
  },

  // 修改某个资源描述的方法
  modify: function(item) {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('modify', resource)
      , args
      , action = function(req, res, next) {
        var errors;
        attr = utils.pickParams(req.params, resource);
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

    args = [item.route].concat(beforeActions).concat(action);
    this.server.put.apply(this.server, args);
  },

  // 根据资源描述添加资源到集合上的方法
  add: function(item) {
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

    args = [item.route].concat(beforeActions).concat(action);
    this.server.post.apply(this.server, args);
  },

  // 删除某个资源
  remove: function(item) {
    var Model = this.Model
      , resource  = this.resource
      , opts  = this.opts
      , beforeActions = this.beforeActions('remove', resource)
      , args
      , action = function(req, res, next) {
        req.model.destroy().success(function(mod) {
          res.send(204);
          next();
        });
      };

    args = [item.route].concat(beforeActions).concat(action);
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
