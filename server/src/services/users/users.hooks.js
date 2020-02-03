const { authenticate } = require('@feathersjs/authentication').hooks;
const mongoose = require('mongoose');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt'),
      async context => {
        const users = mongoose.model('users');
        const allUsers = await users.find({});
        if (context.params.query.email) {
          if ( allUsers.some(user => user.email === context.params.query.email) ) {
            return context;
          } else {
            return Promise.reject(new Error('User does not exist'));
          }
        }
        return context;
      }
    ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword('password') ],
    update: [ hashPassword('password'),  authenticate('jwt') ],
    patch: [ hashPassword('password'),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
