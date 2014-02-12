var _     = require("underscore")
  , utils = require("./utils")
  , Model = require("./model");

function Rest(source, server, sequelize) {
  this.source = source;
  this.server = server;
  this.sequelize = sequelize;
  this.initialize();
};

//扩充实例方法
_.extend(Rest.prototype, {

  initialize: function() {
    var _this = this;

    // 根据source的定义自动创建sequelize 的model类
    this.Model = new Model(this.source, this.sequelize);
    this.Model.sync()

    // 循环注册方法到server上，用来监听客户端发起的请求
    _.each(this.source.methods, function(method) {
      _this[method]();
    });
  },

  // 获取列表的方法
  list: function() {
    this.server.get(this.collectionUri(), function(res, req, next) {
      var options = utils.findAllOpts(req.params, this.source);
      this.Model.count({where: options.where}).success(function(total) {
        this.Model.findAll(options).success(function(list) {
          res.header("X-Content-Record-Total", total);
          res.send(list);
          return next();
        });
      });
    });
  },

  // 获取单个资源详情的方法
  detail: function() {
    this.server.get(this.detailUri(), function(res, req, next) {
      this.Model.find(req.params.id).success(function(model) {
        res.send(model);
        return next();
      });
    });
  },

  // 修改某个资源描述的方法
  modify: function() {
    this.server.put(this.detailUri(), function(res, req, next) {
      this.Model.find(req.params.id).success(function(model) {
        res.send(202, model);
        return next();
      });
    });
  },

  // 根据资源描述添加资源到集合上的方法
  add: function() {
    this.server.post(this.detailUri(), function(res, req, next) {
      res.send(201);
      return next();
    });
  },

  // 删除某个资源
  remove: function() {
    this.server.del(this.detailUri(), function(res, req, next) {
      this.Model.find(req.params.id).success(function(model) {
        res.send(204, model);
        return next();
      });
    });
  },

  // 获取资源集合uri地址
  collectionUri: function() {
    return this.source.collectionUri || '/' + this.source.name + 's';
  },

  //获取资源详情uri地址
  detailUri: function() {
    return this.source.detailUri || '/' + this.source.name + 's/:id';
  }

});

module.exports = Rest;
