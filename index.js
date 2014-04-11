var restify     = require('restify')
  , _           = require('underscore')
  , Rest        = require('./lib/rest')
  , utils       = require('./lib/utils')
  , hooks       = require('./lib/hooks')
  , middleWares = require('./lib/middle-wares')
  , defaults    = require('./lib/defaults');

module.exports = {

  defaults: defaults,

  middleWares: middleWares,

  hooks: hooks,

  utils: utils,

  Rest: Rest,

  init: function(opts) {

    if(opts.basics) {
      _.defaults(opts.basics, defaults.basics);
    }

    if(opts.constant) {
      _.defaults(opts.constant, defaults.constant);
    }

    if(opts.switchs) {
      _.defaults(opts.switchs, defaults.switchs);
    }

    _.defaults(opts, defaults);

    // 将rest库包的个模块附在opts上，方便各处使用
    opts.rest = {
      utils: utils,
      Rest: Rest
    };

    // 初始化sequelize实例
    var sequelize = utils.initDB(opts.db);

    // 设置对外公开的资源以及属性
    opts.pubResources = utils.clone(opts.resources, function(value, key) {
      return key.toString()[0] === '_';
    }, []);

    // 构建全部的model以及他们之间的关系
    utils.initModels(opts.resources, sequelize, opts);

    // 将处理后的methods重新赋值给pubResources
    _.each(opts.pubResources, function(pubResource, key) {
      pubResource.methods = opts.resources[key].methods;
      if(!opts.pubResources[key].associations) {
        return;
      }
      _.each(opts.pubResources[key].associations, function(association, i) {
        association.methods = opts.resources[key].associations[i].methods;
      });
    });

    // 创建web服务
    var server = restify.createServer({
      name: opts.basics.name,
      version: opts.basics.version
    });
    // 将server复制给opts，方便用户自己去做一些事情
    opts.server = server;

    // 设置系统中间件
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    // 合并系统自带的middleWares和用户自定义的middleWares
    // 为了接下来的的处理统一
    opts.middleWares = utils.mergeFns(
      middleWares,
      opts.middleWares,
      opts.switchs.middleWares
    );

    // 合并系统自带的hooks和用户自定义的hooks
    // 为了接下来的的处理统一
    _.each(['beforeActions', 'handleList'], function(name) {
      opts.hooks[name] = utils.mergeFns(
        hooks[name] || [],
        opts.hooks[name] || [],
        opts.switchs.hooks[name] || {}
      );
    });

    // 自定义中间件
    if(opts.middleWares) {
      _.each(opts.middleWares, function(middleWare) {
        server.use(middleWare.action(opts));
      });
    }

    // 提供资源配置的接口，供客户端使用
    server.get('/resources', function(req, res, next) {
      res.send(200, opts.pubResources);
      next();
    });

    // 初始化资源
    // 内部会初始化资源的模型和对应方法的控制器
    _.each(opts.resources, function(resource) {
      new Rest(resource, server, sequelize, opts);
    });

    // 提供apis接口让用户清楚目前提供的接口列表
    Rest.apis(server, '/apis');

    // 监听错误，打印出来，方便调试
    server.on('uncaughtException', function(req, res, route, error) {
      console.error(error);
      console.log(error.stack);
    });

    // 设置监听
    server.listen(opts.basics.port || 8080, function () {
      console.log('%s listening at %s', server.name, server.url);
    });

    return opts;

  }
};
