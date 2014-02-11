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

    // 根据source的定义自动创建sequelize 的model类
    this.Model = new Model(source, sequelize);

    // 循环注册方法到server上，用来监听客户端发起的请求
    _.each(this.source.methods, function(method) {
      this[method]();
    });

  },

  // 获取列表的方法
  index: function() {
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

  // collectionUri
  // 获取集合uri地址
  collectionUri: function() {
    return this.source.collectionUri || '/' + this.source.name + 's';
  },

});

module.exports = Rest;
