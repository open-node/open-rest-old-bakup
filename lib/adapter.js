var Sequelize     = require("sequelize");

module.exports = {

  autoincreament: function(opt) {
    return {
      type: Sequelize.INTEGER
    };
  },

  string: function(opt) {
    var res = {
      type: Sequelize.STRING,
      validate: {}
    };
    if(opt.length) {
      res.validate.len = opt.length;
    }
    return res;
  },

  email: function(opt) {
    return {
      type: Sequelize.STRING,
      validate: {
        isMail: true
      }
    };
  },

  enum: function(opt) {
    return {
      type: Sequelize.STRING,
      values: opt.values
    };
  },

  number: function(opt) {
    var res = {
      type: Sequelize.INTEGER,
      validate: {}
    };
    if(opt.range) {
      if(opt.range[1]) {
        res.validate.max = opt.range[1];
      }
      if(opt.range[0]) {
        res.validate.min = opt.range[0];
      }
    }
    return res;
  };

  date: function(opt) {
    var res = {
      type: Sequelize.STRING,
      validate: {
        isDate: true
      }
    };
    if(opt.range) {
      if(opt.range[1]) {
        res.validate.isBefore = opt.range[1];
      }
      if(opt.range[0]) {
        res.validate.isAfter = opt.range[0];
      }
    }
    return res;
  };

};
