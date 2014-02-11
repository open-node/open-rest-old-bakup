var _       = require("underscore")
  , adapter = require("./adapter");

var Model = function(source, sequelize) {
  this.source = source
  return sequelize.define(source.name, this.adapter());
};

_.extend(Model.prototype, {
  adapter: function() {
    var res = null;
    _.each(this.source, function(opt, name) {
      res[name] = adapter[opt.type || opt](opt);
    });
    return res;
  }
});

module.exports = Model;
