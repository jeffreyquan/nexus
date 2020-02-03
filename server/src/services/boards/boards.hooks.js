const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { isBoardOwner } = require('../authorisation');
const mongoose = require('mongoose');

async function populateUsers(context) {
  const userIds = context.result.users;

  const promises = userIds.map(userId => context.app.service('users').get(userId));

  return Promise.all(promises).then(data => {
    context.result.users = data;
    return context;
  });
}

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
      }),
      async context => {
        const boardId = context.id;
        const boards = mongoose.model('boards');
        const board = await boards.findOne({_id: boardId });
        if (context.data.$push.users) {
          if (board.users.some(user => user._id.toString() === context.data.$push.users.toString())) {
            return Promise.reject(new Error('User already added to board'));
          } else {
            return context;
          }
        }
      }
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
    get: [populateUsers],
    create: [],
    update: [],
    patch: [populateUsers],
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
