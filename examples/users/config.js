module.exports = {
  name: 'Standard REST example users',
  version: '0.0.1',
  port: 7788,
  sources: [{
    name: 'user',
    methods: ['get', 'post', 'put', 'del'],
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
      credit: {
        type: 'number',
        range: [0, 999999999],
        default: 10
      }
    }
  }]
};
