module.exports = function(opts) {
  return function(req, res, next) {
    console.log("Second middle-waves start");
    console.log(req.user.name);
    console.log(req.user.id);
    console.log(req.user.updatedAt);
    console.log(new Date)
    console.log("Second middle-waves end");
    next();
  };
};
