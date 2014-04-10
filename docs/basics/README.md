# 基础知识

* open-rest 使用到了一下 npm 库包
  * restify
  * underscore
  * sequelize
  * mysql

* open-rest 使用方法为
```javascript
var rest = require("open-rest");
rest.init(opts);
```

* open-rest 会暴露出以下功能接口
  * `defaults` open-rest 系统内置的默认参数
  * `middleWares` open-rest 系统内置的中间件
  * `hooks` open-rest 系统内置的钩子
  * `utils` open-rest 系统内置的功能函数库
  * `Rest` open-rest 系统内的 Rest 原型类

* rest.init(opts) 会返回处理后的当前正在使用的 opts， opts 包含一下几个重要的元素
  * `server` 此 server 就是基于 restify createServer 出来的，如果有必要的话开发者可以基于这个`server` 去监听自己的route
  * `middleWares` 最终使用的中间件，合并了用户自定义的和系统内置的，并且经过开关过滤的，即关闭的中间件不会出现在这里
  * `hooks` 最终使用的钩子集合，同样也是合并了自定义和内置的，且过滤掉关闭的那些钩子
