const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// we have an issue here. either make each document a new entry in the list so the GET for the list would just be all items.
// or we need to use some arrays or something and keep the list per user?

const shoppingListSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      default: '1',
    },
    updated: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'shoppingList' }
);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
