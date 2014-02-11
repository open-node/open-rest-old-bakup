module.exports = {
  name: 'Standard REST example users',
  version: '0.0.1',
  port: 7788,
  sources: [{
    name: 'user',
    methods: ['index', 'get', 'post', 'put', 'del'],
    attributes: {
      id: 'autoincreament',
      name: {
        type: 'string',
        length: [6, 20],
        unique: true
      },
      email: {
        type: 'email',
        unique: true
      },
      gender: {
        type: 'enum',
        values: ['male', 'female'],
        default: 'male'
      },
      birthday: {
        type: 'date',
        range: ['1900-01-01', '2014-01-01']
      },
      credit: {
        type: 'number',
        range: [0, 999999999],
        default: 10
      }
    }
  }]
};
