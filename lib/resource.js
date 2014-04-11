/**
 * 处理资源的定义，将一些需要使用的属性提前处理出来，
 * 因为这些属性只和资源定义有关
 * 所以提前处理可以避免使用的时候重复处理带来的不必要资源消耗
 * 比如资源的关系 associations 需要处理出一些find时候的特殊参数
 */

var _ = require("underscore");

var Resource = function(resource, models, opts) {
  this.opts = opts;
  this.resource = resource;
  this.models = models;
  this.initialize();
  return this.resource;
};

//扩充实例方法
_.extend(Resource.prototype, {

  initialize: function() {

    // 设置 self 对应的字段名称，用来判断资源是否是自己的
    // 默认是 userId, 如果不需要请指定为false
    if(!this.resource.selfId && this.resource.selfId !== false) {
      this.resource.selfId = 'userId';
    }

    // resource 的默认属性或者方法的继承
    _.defaults(this.resource, this.opts.resource);

    this.methods();
    this.associations();
    this.attributes();
  },

  attributes: function() {
    // 设置attrs 这些字段是可以写入的
    // 按照用户角色来划分
    var writebleAttrs = {'__self': []}
      , roles = [];

    if(this.models.user) {
      roles = this.models.user.resource.attributes.role.values;
    }

    _.each(roles, function(role) {
      writebleAttrs[role] = [];
    });

    _.each(this.resource.attributes, function(value, key) {
      if(key === 'id' || value.readOnly === true) {
        return;
      }
      if(value.writebleRoles) {
        _.each(value.writebleRoles, function(role) {
          writebleAttrs[role].push(key);
        });
      } else {
        _.each(writebleAttrs, function(list, role) {
          list.push(key)
        });
      }
    });
    this.resource.writebleAttrs = writebleAttrs;
  },

  associations: function() {
    var _this     = this
      , models    = _this.models
      , resource  = _this.resource;

    // 兼容处理，如果没有定义则直接赋值为空数组
    if(!resource.associations) {
      resource.associations = [];
    }

    resource.associations = _.map(resource.associations, function(item) {
      if(!item.opts) {
        item.opts = {};
      }
      if(!item.opts.foreignKey) {
        item.otps.foreignKey = item.model + 'Id';
      }
      if(!item.opts.as) {
        item.opts.as = item.model;
      }
      item.methods = _this._methods(item.methods);
      item.methods = _.map(item.methods, function(x) {
        var base;
        if(!x.route) {
          base = '/' + item.opts.as + 's/:' + item.opts.foreignKey + '/' + resource.name + 's';
          x.route = _this.route(x.method, base);
        }
        return x;
      });
      return item;
    });

    // 初始化关系的 findOpts 这个属性的作用是
    // 获取资源描述的时候将 关系数据的描述一并获取到
    // 方便客户端用户使用
    resource.associations.findOpts = {};
    _.each(resource.associations, function(item) {
      if(item.method === 'belongsTo') {
        if(!resource.associations.findOpts.include) {
          resource.associations.findOpts.include = []
        }
        resource.associations.findOpts.include.push({
          model: models[item.model],
          as: item.opts.as
        });
      }
    });
  },

  methods: function() {
    var _this = this;
    this.resource.methods = this._methods(this.resource.methods);
    this.resource.methods = _.map(this.resource.methods, function(x) {
      if(!x.route) {
        x.route = _this.route(x.method, base = '/' + _this.resource.name + 's');
      }
      return x;
    });
  },

  route: function(method, base) {
    var name = this.resource.name
      , detail = base + '/:id'
      , map = {
        list: base,
        detail: detail,
        modify: detail,
        add: base,
        remove: detail
      };
    return map[method];
  },

  _methods: function(methods) {
    var defaults = this.opts.constant.pagination;

    if(!methods) {
      return [];
    }

    return _.map(methods, function(x) {
      // 如果是字符串的，将其转换为对象的描述方式，这样会简化后续的判断和处理，
      // 后续的判断和处理就不需要兼容两种模式，而只需要按照统一的对象的处理方式即可
      if(_.isString(x)) {
        x = {
          method: x,
          roles: []
        }
      }
      // 如果没有指定角色列表，直接赋值一个空的列表
      // 同样是为了统一接下来的处理流程
      if(!x.roles) {
        x.roles = []
      }

      // 如果是list则将pagination 进行_.defaults 处理
      if(x.method === 'list') {
        x.pagination = _.defaults({}, x.pagination, defaults);
      }

      // 如果没有指定route，则处理route path
      return x;
    });
  },

});

module.exports = Resource;
