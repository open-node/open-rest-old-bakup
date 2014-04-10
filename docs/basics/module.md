# open-rest 组成部分

* opts 所有的配置信息，中间件，钩子，以及server都会附属上去，是一个巨大的对象
* utils open-rest 的库函数模块
* Rest open-rest 内部根据 resource 的定义生成api的原型类
* Model open-rest 内部根据 resource 生成 sequelize 的 model 类定义
* Resource open-rest 内部根据 resource 做一些提前的兼容处理,为了后续的处理更加统一的简介
* adapter open-rest 内部转换 resource.attributes 的格式，为了更好的适应 sequlize 的要求
