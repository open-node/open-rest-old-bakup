module.exports = {
  name: 'Standard REST example users',
  version: '0.0.1',
  port: 7788,
  db: {
    name: 'example_user',
    user: 'root',
    pass: '123457',
    dialect: 'mysql',
    define: {
      engine: 'MYISAM'
    }
  },
  resources: [{
    name: 'user',
    methods: ['list', 'detail', 'add', 'modify', 'remove'],
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
        }
      },
      intro: {
        type: 'text',
        validate: {
          len: [0, 1000]
        }
      }
    }
  }]
};
