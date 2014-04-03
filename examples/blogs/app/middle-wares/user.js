/**
 * 这个中间件用来处理当前用户信息
 * 根据access_token来获取当前用户
 * 处理后的当前用户信息会附加到 req上 req.user
 */

module.exports = function(opts) {
  return function(req, res, next) {
    var token = getToken(req);
    console.log("Handler current user middle-wares");
    // token不存在则清掉 req.user 之后执行next
    if(!token) {
      req.user = null;
      return next();
    }
    // 根据access_token 从user表读取数据
    User = opts.rest.utils.model('user');
    User.find(1).success(function(user) {
      req.user = user || null;
      next();
    });
  };
};

var getToken = function(req) {
  return (req.params.access_token || '').trim();
};
