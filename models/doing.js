const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doing = new Schema(
  {
    userId: {
      type: String,
    },
    startedDate: {
      type: Date,
    },
    updated: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'users' }
);

module.exports = mongoose.model('Doing', doing);
