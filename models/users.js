const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: {
      type: String
    },
    updated: {
      type: Date,
      default: new Date()
    }
  },
  { collection: 'users' }
);

module.exports = mongoose.model('Users', UserSchema);
