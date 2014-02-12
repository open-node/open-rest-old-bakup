var Sequelize = require("sequelize")
  , _         = require("underscore");

var utils = {
  initDB: function(opt) {
    return new Sequelize(opt.name, opt.user, opt.pass, opt);
  },

  findAllOpts: function(params, resource) {
    return {
      where: null
    }
  },

  pickParams: function(params, resource) {
    return _.pick(params, _.keys(resource.attributes));
  }
};

module.exports = utils;
