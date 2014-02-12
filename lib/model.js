var _       = require("underscore")
  , adapter = require("./adapter");

var Model = function(resource, sequelize) {
  this.resource = resource
  return sequelize.define(resource.name, this.adapter());
};

_.extend(Model.prototype, {
  adapter: function() {
    var res = {};
    _.each(this.resource.attributes, function(opt, name) {
      res[name] = adapter(opt);
    });
    return res;
  }
});

module.exports = Model;
