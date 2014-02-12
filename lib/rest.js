var _     = require("underscore")
  , utils = require("./utils")
  , Model = require("./model");

function Rest(resource, server, sequelize) {
  this.resource = resource;
  this.server = server;
  this.sequelize = sequelize;
  this.initialize();
};

//扩充实例方法
_.extend(Rest.prototype, {

  initialize: function() {
    var _this = this;

    // 根据resource的定义自动创建sequelize 的model类
    this.Model = new Model(this.resource, this.sequelize);
    this.Model.sync()

    // 循环注册方法到server上，用来监听客户端发起的请求
    _.each(this.resource.methods, function(method) {
      _this[method]();
    });
  },

  // 获取列表的方法
  list: function() {
    var Model = this.Model
      , resource  = this.resource;
    this.server.get(this.collectionUri(), function(req, res, next) {
      var options = utils.findAllOpts(req.params, resource);
      Model.count({where: options.where}).success(function(total) {
        Model.findAll(options).success(function(list) {
          res.send(200, list);
          next();
        });
      });
    });
  },

  // 获取单个资源详情的方法
  detail: function() {
    var Model = this.Model;
    this.server.get(this.detailUri(), function(req, res, next) {
      Model.find(req.params.id).success(function(model) {
        res.send(model);
        next();
      });
    });
  },

  // 修改某个资源描述的方法
  modify: function() {
    this.server.put(this.detailUri(), function(req, res, next) {
      this.Model.find(req.params.id).success(function(model) {
        res.send(202, model);
        next();
      });
    });
  },

  // 根据资源描述添加资源到集合上的方法
  add: function() {
    var Model = this.Model
      , resource  = this.resource;
    this.server.post(this.collectionUri(), function(req, res, next) {
      var model
        , errors
        , attrs = utils.pickParams(req.params, resource);

      delete attrs.id
      model = Model.build(attrs)
      errors = model.validate();
      if(errors) {
        res.send(500, errors);
        next();
      }
      model.save().success(function(mod) {
        res.send(201, mod);
        next();
      });
    });
  },

  // 删除某个资源
  remove: function() {
    this.server.del(this.detailUri(), function(req, res, next) {
      this.Model.find(req.params.id).success(function(model) {
        res.send(204, model);
        next();
      });
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
