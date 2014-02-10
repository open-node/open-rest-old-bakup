module.exports = {
  server: function(source, server) {
    server.get('/echo/:name', function (req, res, next) {
      res.send(req.params);
      return next();
    });
  }
};
