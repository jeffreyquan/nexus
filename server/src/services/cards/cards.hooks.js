const { authenticate } = require('@feathersjs/authentication').hooks;
const { isBoardUser } = require('../authorisation');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [isBoardUser],
    get: [isBoardUser],
    create: [isBoardUser],
    update: [isBoardUser],
    patch: [isBoardUser],
    remove: [isBoardUser]
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
