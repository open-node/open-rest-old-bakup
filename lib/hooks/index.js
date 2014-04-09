module.exports = {
  /**
   * 控制器action执行前的hook
   */
  beforeActions: require("./before-actions"),

  /**
   * 过滤列表结果
   */
  handleList: require("./handle-list"),
};

