# methods
<pre> 对外提供的方法列表，数组类型，数组的每一项结构如下</pre>

```js
Sting enum(list, modify, add, detail, remove)
```
或者
```js
{
  method: 'list',
  route: '/users',
  roles: [] // 允许的访问的角色白名单
}
```

<pre> 当 method 为 list 的时候，属性里会增加一下一些可选项</pre>
* `pagination` 用来控制分页的一组参数，是一个 object，默认取自 options.list.pagination
  * `maxResults` 默认的返回结果条目数
  * `maxResultsLimit` 结果条目数的最大值，客户端请求的时候maxResults 不能超过这个值
  * `maxStartIndex` 最大的翻页 offset，避免过大的翻页导致查询 limit 太慢
* `sort` list 的排序方式，是一个 object，默认取自 options.list.sort
  * `default` 默认的排序方式，可选参数，数组格式，形如 ['id', 'DESC'] 表示默认 id 降序排列
  * `allow` 允许排序的列名称, 数组格式，白名单机制
* `filter` 允许过滤的列名称，数组格式，白名单机制
