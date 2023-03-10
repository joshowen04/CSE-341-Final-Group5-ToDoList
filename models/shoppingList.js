const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const shoppingListSchema = new Schema(
  {
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
    }
  },
  { collection: 'shoppingList' }
);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
