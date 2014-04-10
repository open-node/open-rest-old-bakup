# options

<pre>客户和open-rest连接的唯一纽带就是这个options</pre>
```js
  var rest    = require('open-rest')
    , options = require('./app');
  rest.init(options);
```

## options 包含了很多内容解析来逐一的介绍

  * [basics](/docs/options/basics.md)
  * [constant](/docs/options/constant.md)
  * [db](/docs/options/db.md)
  * [middleWares](/docs/options/middle-wares.md)
  * [hooks](/docs/options/hooks.md)
  * [resources](/docs/options/resources.md)
    * [resource](/docs/resource/README.md)
      * [resource](/docs/resource/README.md)
        * [methods](/docs/resource/methods.md)
        * [associations](/docs/resource/associations.md)
        * [attributes](/docs/resource/attributes.md)
  * [switchs](/docs/options/switchs.md)
