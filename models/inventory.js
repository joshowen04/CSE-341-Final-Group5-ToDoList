const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    },
    minimumQuantity: {
      type: String,
      required: true
    },
    updated: {
      type: Date,
      default: new Date()
    }
  },
  { collection: 'inventory' }
);

module.exports = mongoose.model('Inventory', inventorySchema);
