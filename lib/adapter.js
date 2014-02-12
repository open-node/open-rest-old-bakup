var Sequelize     = require("sequelize");

module.exports = function(opt) {
  opt.type = Sequelize[opt.type.toUpperCase()]
  return opt;
};
