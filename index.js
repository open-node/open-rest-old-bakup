var restify = require('restify')
  , _       = require("underscore")
  , rest    = require('./lib/core');

module.exports = function(opts) {
  var server = restify.createServer({
    name: opts.name,
    version: opts.version
  });

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  _.each(opts.sources, function(source) {
      rest.server(source, server);
  });

  server.listen(opts.port || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
};
