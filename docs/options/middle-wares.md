# middleWares

<pre> 中间件，用户自定义的中间件</pre>
* 数据类型，数组的每一项是一个对象，对象结构如下
* item
```js
{
  name: 'user',
  action: function(opts) {
    return function(req, res, next) {
      next();
    }
  }
}
```
