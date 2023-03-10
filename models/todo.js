const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    userId: {
      type: String
    },
    created: {
      type: Date
    },
    proprosedStartDate: {
      type: Date
    },
    neededby: {
      type: Date
    },
    actualStartDate: {
      type: Date
    },
    actualEndDate: {
      type: Date
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    type: {
      type: String
    },
    subTasks: {
      type: String
    },
    priority: {
      type: Date
    },
    status: {
      type: Date
    },
    updated: {
      type: Date,
      default: new Date()
    },
  },
  { collection: 'todo' }
);

module.exports = mongoose.model('Todo', todoSchema);
