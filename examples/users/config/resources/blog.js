module.exports = {

  // 资源名称，也是表名，也是model的名称
  // 同时rest api的uri也会通过name来构造,除非有特殊定义collectionUri 或者 detailUri
  name: 'blog',

  // 资源对外提供的方法
  // list 获取资源列表
  // detail 获取某个特定资源的详情
  // add 添加资源
  // modify 修改某个资源描述
  // remove 移除某个资源
  methods: ['list', 'detail', 'add', 'modify', 'remove'],

  // 资源属性的定义，完全参考sequelize 的model 的define
  // type: integer <=> Sequelize.INTEGER
  attributes: {
    id: {
      type: 'integer',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: 'string',
      unique: true,
      validate: {
        len: [6, 20]
      }
    },
    content: {
      type: 'text',
      validate: {
        len: [0, 64 * 1024]
      }
    }
  }
};
