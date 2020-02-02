const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { isBoardOwner } = require('../authorisation');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      setField({
        from: 'params.user._id',
        as: 'params.query.users'
      })
    ],
    get: [
      setField({
        from: 'params.user._id',
        as: 'params.query.users'
      })
    ],
    create: [
      setField({
        from: 'params.user._id',
        as: 'data.owner'
      }),
      setField({
        from: 'params.user._id',
        as: 'data.users'
      })
    ],
    update: [
      setField({
        from: 'params.user._id',
        as: 'params.query.owner'
      })
    ],
    patch: [
      setField({
        from: 'params.user._id',
        as: 'params.query.owner'
      })
    ],
    remove: [
      setField({
        from: 'params.user._id',
        as: 'params.query.owner'
      }),
      isBoardOwner
    ]
  },

  after: {
    all: [],
    find: [],
    get: [
      async context => {
        const userIds = context.result.users;
        
        const promises = userIds.map(userId => context.app.service('users').get(userId));
      
        return Promise.all(promises).then(data => {
          context.result.users = data;
          return context;
        });
      }
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
