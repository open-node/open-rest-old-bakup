var Sequelize = require("sequelize");

var utils = {
  initDB: function(opt) {
    return new Sequelize(opt.name, opt.user, opt.pass, opt);
  }
};

module.exports = utils;
