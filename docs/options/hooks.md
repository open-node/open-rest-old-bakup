# hooks

<pre>控制器方法执行前执行</pre>
* hash对象，对象的key是钩子名称，值是钩子执行的函数列表，是一个数组类型
```js
{
  /**
   * 控制器action执行前的hook
   */
  beforeActions: [item]

  /**
   * 过滤列表结果
   */
  handleList: [item]
}
```

* 钩子执行的函数列表中每一个item的结构如下
```js
{
  name: 'attributes-filter',
  action: function(opts, req, list) {
    return list;
  }
}
```
