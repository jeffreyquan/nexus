const mongoose = require('mongoose');

async function isBoardOwner(context) {
  const boardId = context.params.query.boardId || context.data.boardId;
  const { _id } = context.params.user;
  const boards = mongoose.model('boards');
  const board = await boards.findOne({ _id: boardId });
  if (board) {
    if (board.owner.toString() === _id.toString()) {
      return context;
    } else {
      return Promise.reject(new Error('Unauthorised'));
    }
  }
  return context;
}

async function isBoardUser(context) {
  const boardId = context.params.query.boardId || context.data.boardId;
  const { _id } = context.params.user;
  const boards = mongoose.model('boards');
  const board = await boards.findOne({ _id: boardId });
  if (board) {
    if ( board.users.some(user => user._id.toString() === _id.toString()) ) {
      return context;
    } else {
      return Promise.reject(new Error('Unauthorised'));
    }
  }
  return context;
}
module.exports = { isBoardOwner, isBoardUser };