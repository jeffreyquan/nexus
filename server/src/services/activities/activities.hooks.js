const { authenticate } = require('@feathersjs/authentication').hooks;
const { isBoardUser } = require('../authorisation');
const { setField } = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [isBoardUser],
    get: [isBoardUser],
    create: [
      setField({
        from: 'params.user._id',
        as: 'data.userId'
      })
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
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
