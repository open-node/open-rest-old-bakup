# attributes
<pre> 资源字段的描述，数组类型，每一项是一个独立的对象，形如</pre>
```js
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
```
