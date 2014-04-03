module.exports = function(opts) {

  return function(req, res, next) {
    next().then(function() {
      console.log("Second middle-waves start");
      console.log(req.params);
      console.log(new Date)
      console.log("Second middle-waves end");
    });
  };
};
