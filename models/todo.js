const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    userId: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    updated: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'users' }
);

module.exports = mongoose.model('Todo', todoSchema);
