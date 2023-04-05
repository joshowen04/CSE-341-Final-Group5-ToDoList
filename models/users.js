const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    googleId: {
      type: String,
      required: false
    },
    userName: {
      type: String,
      required: true
    }
  },
  { collection: 'users' }
);

module.exports = mongoose.model('Users', UserSchema);
