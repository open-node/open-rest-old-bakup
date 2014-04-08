var utils     = require('../../utils');

/**
 * 当url参数中有id时，获取该id对应的资源,方便后续的使用和权限的判断
 * 附加到 req 上, req.model 指向该资源
 * 因此rest的地址需要遵循此规则
 */

module.exports = {
  name: 'currentModel',
  action: function(opts, req, res, next) {
    if(!req.params.id || !opts.association) {
      return next();
    }
    var success = function(model) {
      if(!model) {
        res.send(404, new Error(req.i18n.t('Resource not found')));
      } else {
        req.model = model;
        next();
      }
    };
    if(opts.association) {
      // 根据关联资源获取当前model
      var Model = utils.model(opts.association.model);
      Model.find(+req.params[opts.association.opts.foreignKey]).success(success);
    } else {
      var Model = utils.model(opts.resource.name);
      Model.find(+req.params.id).success(success);
    }
  }
};
