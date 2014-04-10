# 介绍

### open-rest 帮助您快速开发标准rest接口,只需要定义简单的一些资源的描述和他们之间的关系就可以替您生成restapi，open-rest 主要基于 restify、以及 sequelize，open-rest 主要具有一下特征和优势

* 快速完成restapi开发
  <pre>开发人员可以把更多的精力用在理解业务需求，和设计资源数据，以及他们的关系上，而一旦这些资源数据以及关系被定义了，restapi也意味着开发完成了。</pre>

* 提供简单易用的权限模型
  * open-rest 默认为您提供了用户-角色的定义，您可以对角色进行一下程度控制
    * 接口资源以及动作的控制，比如角色为 `member` 的用户，不能访问 DELETE: /users/:id
    * 资源特殊的属性控制，比如角色为 `member` 的用户，不能修改自己的 `role` 的属性，
      ```js
      $.ajax({
        method: 'PUT',
        url: '/users/88',
        data: {
          role: 'admin'
        }
      })
      // 这个请求虽然不会失败，但是id为88的用户的role并不会被修改，系统会自动忽略
      ```
* 完善的中间件以及钩子机制, 系统内置如下中间件和钩子
  * 中间件
    * body-parser 对某些诡异客户端，不按照http规范提交 content-type 时request.body 为json数据的解析
    * i18n  根据当前用户请求提交的头部来设置当前请求使用的i18n函数,赋值给 req.i18n
    * user 自动根据 request.params.access_token 来设置当前用户，赋值给 req.user

  * 钩子
    * beforeActions 此类钩子会在每次请求路由匹配成功后执行，执行完毕后正常的控制器方法才会执行
      * currentModel 设置当前的请求的model，
        <pre>
          比如 /users/1 会获取id为1的用户，赋值给req.model
          比如 /authors/2/blogs 会获取id为2的作者，赋值给 req.model
          比如 /users 此钩子并不会执行任何操作
        </pre>
      * checkPriv 判断当前用户是否有权访问该接口、执行该操作

* open-rest 提供了完整的功能开关，开发这可以通过简单的配置开关的值来实现对某些功能的启动或则停用

* 通过简单的定义资源之间的关系即可提供复杂的接口出来
  比如有资源 user、blog 那么在blog上定义资源关系，belongsTo user as author authorId
  则open-rest会就可以帮您提供出 /authors/:authorId/blogs 的接口出来，支持list和add方法

* open-rest 处处遵循着`约定大于配置`的业内共识，但是几乎每一个设置或者约定都可以按照您喜欢的方式去重新定义

