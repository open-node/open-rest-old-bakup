# associations
<pre> 资源与其他资源的关系，可选项，数组类型，每一项的结构如下</pre>
```js
{
  method: 'belongsTo',
  model: 'user',
  opts: {
    foreignKey: 'authorId',
    as: 'author'
  },
  // 是否提供对外的方法来基于资源的关系来操作(添加、获取)资源
  methods: [{
    method: 'list',
  }, {
    method: 'add',
    roles: ['admin', '__self']
  }]
}
```
