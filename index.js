var restify     = require('restify')
  , _           = require("underscore")
  , Rest        = require('./lib/rest')
  , utils       = require('./lib/utils');

module.exports = function(opts) {

  // 初始化sequelize实例
  var sequelize = utils.initDB(opts.db);

  // 创建web服务
  var server = restify.createServer({
    name: opts.name,
    version: opts.version
  });

  // 设置中间件
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  // 自定义中间件
  if(opts.middleWares) {
    _.each(opts.middleWares, function(middleWare) {
      server.use(middleWare(opts));
    });
  }

  // 初始化资源
  // 内部会初始化资源的模型和对应方法的控制器
  _.each(opts.resources, function(resource) {
    new Rest(resource, server, sequelize, opts);
  });

  // 设置监听
  server.listen(opts.port || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  });

};
