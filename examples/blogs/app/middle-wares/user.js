module.exports = function(opts) {

  return function(req, res, next) {
    console.log("First middle-waves start");
    console.log(req.params);
    console.log(new Date)
    console.log("First middle-waves end");
    next();
  };
};
