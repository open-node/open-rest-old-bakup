# 自有api接口

## open-rest 默认提供了两个api接口，风别是

* /apis 返回系统提供的所有接口的列表
  ```javascript
  [{
    verb: "get", // verb http 动作可能的取值是 `get`, `post`, `put`, `patch`, `delete`
    path: "/blogs", // 监听的路径或者说路由
    roles:[] // 允许访问的用户角色，为空是所有的角色都可以访问
  }]
  ```

* /resources 返回系统资源的定义的列表
  ```javascript
  [{

    // 资源名称，也是表名，也是model的名称
    // 同时rest api的uri也会通过name来构造,除非有特殊定义collectionUri 或者 detailUri
    name: 'user',

    // 设置__self 对应的字段名称，用来判断资源是否是自己的，默认是 userId
    self: 'id',

    // 资源对外提供的方法
    // list 获取资源列表
    // detail 获取某个特定资源的详情
    // add 添加资源
    // modify 修改某个资源描述
    // remove 移除某个资源
    methods: [{
      method: 'list',
      roles: ['admin']
    }, {
      method: 'detail',
    }, {
      method: 'add',
    }, {
      method: 'modify',
      roles: ['__self', 'admin']
    }, {
      method: 'remove',
      roles: ['admin']
    }],

    // 当前资源和其他资源之间的结合关系
    associations: [{
      method: 'hasMany',
      model: 'blog',
      opts: {
        foreignKey: 'authorId',
        as: 'blogs'
      },
    }],

    // 资源属性的定义，完全参考sequelize 的model 的define
    // type : integer <=> Sequelize.INTEGER
    attributes: {
      id: {
        type: 'integer',
        unsigned: true,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: 'string',
        unique: true,
        validate: {
          len: [6, 20]
        }
      },
      role: {
        type: 'enum',
        values: ['admin', 'member'],
        defaultValue: 'member',
        // 拥有写权限的角色组
        writebleRoles: ['admin']
      },
      email: {
        type: 'string',
        unique: true,
        validate: {
          isEmail: true
        }
      },
      gender: {
        type: 'enum',
        values: ['male', 'female'],
        defaultValue: 'male'
      },
      birthday: {
        type: 'date',
        validate: {
          isAfter: '1900-01-01',
          isBefore: '2014-01-01'
        }
      },
      credit: {
        type: 'integer',
        unsigned: true,
        defaultValue: 10,
        validate: {
          min: 0,
          max: 999999999
        },
        // 拥有写权限的角色组
        writebleRoles: ['admin']
      },
      accessToken: {
        type: 'string',
        validate: {
          len: [0, 200]
        },
        // 是否只读
        readOnly: true,
        // 是否隐藏此字段，隐藏的话，在资源描述中不可见
        hidden: true
      },
      intro: {
        type: 'text',
        validate: {
          len: [0, 1000]
        }
      }
    }
  }]
  ```
