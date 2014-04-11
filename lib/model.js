var _       = require("underscore")
  , adapter = require("./adapter");

var Model = function(resource, sequelize) {
  this.resource = resource;
  var _Model = sequelize.define(resource.name, this.adapter(), this.methods());
  _Model.resource = resource;
  return _Model;
};

_.extend(Model.prototype, {
  adapter: function() {
    var res = {};
    _.each(this.resource.attributes, function(opt, name) {
      res[name] = adapter(opt);
    });
    return res;
  },
  methods: function() {
    var res = {}
      , resource = this.resource
      , attrs = [];

    _.each(resource.attributes, function(x, attr) {
      if(x.hidden === true) {
        attrs.push(attr);
      }
    });
    res.instanceMethods = {
      toJSON: function() {
        var res = _.omit(this.dataValues, attrs);
        return resource.model2json(res, this, resource);
      }
    };
    return res;
  }
});

module.exports = Model;
