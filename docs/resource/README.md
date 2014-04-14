# resource

### options.resource 是 resources 数组中每一个 resource 的默认属性, 每一个resource 未设置的属性都会继承options.resource 的属性


### resources 中每一个 resource 的描述如下

* `name` 资源的名称，数据库的表名和资源请求的路径都会受它的影响
  <pre> 例如: 资源名称定义为 user,那么表名就是 users, 获取用户列表就是 /users, 获取某个用户就是 /users/:id</pre>

* `self` 设置 `__self` 对应的字段名称，用来判断资源是否是自己的，默认是 userId
* `methods` 设置该资源需要对外提供的方法，是一个数组类型，具体的每一项请参考[methods](methods.md)

* `associations` 设置该资源与其他资源之间的关系，详情参考[associations](associations.md)
* `attributes` 设置该资源的属性，详情参考[attributes](attributes.md)
* `model2json` 函数类型，输出的时候用来处理数据的，
  * arguments
    * `attrs` 经过过滤后的属性值的对象
    * `model` 原始的model对象，拥有所有的属性和方法，具体参考 [Sequelize model](http://sequelizejs.com/docs/latest/instances)
    * `resource` open-rest 体系下该资源的定义对象
  * return 返回一个数据对象
