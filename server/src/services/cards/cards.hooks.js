const { authenticate } = require('@feathersjs/authentication').hooks;
const { isBoardOwner } = require('../authorisation');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [isBoardOwner],
    get: [],
    create: [],
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
