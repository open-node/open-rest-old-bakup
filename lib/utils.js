var Sequelize = require("sequelize")
  , _         = require("underscore")
  , Model     = require("./model")
  models      = {};

var utils = {

  model: function(name, resource, sequelize) {
    if(!models[name]) {
      models[name] = new Model(resource, sequelize);
    }
    return models[name];
  },

  initDB: function(opt) {
    return new Sequelize(opt.name, opt.user, opt.pass, opt);
  },

  findAllOpts: function(params, resource) {
    return {
      where: null
    }
  },

  getAccessToken: function(req) {
    return req.params.access_token || req.params.accessToken;
  },

  pickParams: function(params, resource) {
    return _.pick(params, _.keys(resource.attributes));
  }

};

module.exports = utils;
