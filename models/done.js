const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const done = new Schema(
  {
    userId: {
      type: String,
    },
    endDate: {
      type: Date,
    },
    updated: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'users' }
);

module.exports = mongoose.model('Done', done);
