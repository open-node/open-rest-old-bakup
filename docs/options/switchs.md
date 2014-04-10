# switchs
<pre> 中间件和钩子的开关, 树状结构，形态如下:</pre>

```js
  switchs: {
    // 中间件开关
    middleWares: {},

    // hook开关
    hooks: {
      // 控制器主体函数执行前的钩子
      beforeActions: {
        //系统自带处理当前用户信息的钩子
        checkPriv: true,
        //系统自带处理当前model信息的钩子
        currentModel: true
      },
      // 过滤列表结果的钩子
      handleList: {
        attributes: false
      },
    }
  }
```
