const Todo = require('../models/todo')
const mongoose = require('mongoose');

exports.findByUserId = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Todo.find({ userId: req.params.uid })
      .then(todos => {
        res.setHeader('Content-Type', 'application/json');
        if (todos.length > 0) {
          res.status(200).json(todos);
        } else {
          res.status(404).json({ message: 'No todos found' });
        }
      })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.findById = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Todo.find({ _id: req.params.id })
      .then(todos => {
        res.setHeader('Content-Type', 'application/json');
        if (todos.length > 0) {
          res.status(200).json(todos);
        } else {
          res.status(404).json({ message: 'Todo not found' });
        }
      })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.findByStatus = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Todo.find({ status: req.params.status })
      .then(todos => {
        res.setHeader('Content-Type', 'application/json');
        if (todos.length > 0) {
          res.status(200).json(todos);
        } else {
          res.status(404).json({ message: 'No todos found' });
        }
      })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.findByType = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Todo.find({ type: req.params.type.toLowerCase() })
      .then(todos => {
        res.setHeader('Content-Type', 'application/json');
        if (todos.length > 0) {
          res.status(200).json(todos);
        } else {
          res.status(404).json({ message: 'No todos found' });
        }
      })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.addTodoItem = function (req, res) {
  try {
    const doc = {
      userId: req.body.userId,
      created: req.body.created,
      proposedStartDate: req.body.proposedStartDate,
      neededBy: req.body.neededBy,
      actualStartDate: req.body.actualStartDate,
      actualEndDate: req.body.actualEndDate,
      title: req.body.title,
      text: req.body.text,
      type: req.body.type,
      subTasks: req.body.subTasks,
      priority: req.body.priority,
      status: req.body.status,
      lastUpdated: req.body.lastUpdated,
    }

    const allFieldsExist = doc.userId && doc.created && doc.proposedStartDate && doc.neededBy && doc.actualStartDate && doc.actualEndDate && doc.title && doc.text && doc.type && doc.subTasks && doc.priority && doc.status && doc.lastUpdated;
    if (!allFieldsExist) {
      res.status(400).json({ message: 'All fields must be filled out.' });
      return
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    const newTodo = new Todo(doc);
    // Save the new document to the database
    newTodo.save({ new: true })
      .then(todo => {
        res.status(201).json({ _id: todo._id });
      })
      .catch(error => {
        res.status(500).json(
          error || 'Some error occurred while creating the move.'
        );
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.updateTodoItem = function (req, res) {
  try {
    const doc = {
      userId: req.body.userId,
      created: req.body.created,
      proposedStartDate: req.body.proposedStartDate,
      neededBy: req.body.neededBy,
      actualStartDate: req.body.actualStartDate,
      actualEndDate: req.body.actualEndDate,
      title: req.body.title,
      text: req.body.text,
      type: req.body.type,
      subTasks: req.body.subTasks,
      priority: req.body.priority,
      status: req.body.status,
      lastUpdated: req.body.lastUpdated,
    }

    const allFieldsExist = doc.userId && doc.created && doc.proposedStartDate && doc.neededBy && doc.actualStartDate && doc.actualEndDate && doc.title && doc.text && doc.type && doc.subTasks && doc.priority && doc.status && doc.lastUpdated;
    if (!allFieldsExist) {
      res.status(400).json({ message: 'All fields must be filled out.' });
      return
    }
    if (req.params.id.length !== 24) {
      res.status(400).json({ message: 'Invalid ID.' });
      return
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Todo.findByIdAndUpdate(req.params.id, doc, { new: true }).then((result) => {
      if (result) {
        res.status(204).json(doc);
      } else {
        res.status(404).json({ message: 'Item not found' })
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.deleteTodoItem = function (req, res) {
  try {
    if (req.params.todoId.length !== 24) {
      res.status(400).json({ message: 'Invalid ID.' });
      return
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Todo.findOneAndDelete({ _id: req.params.todoId }).then(function () {
      res.status(204).json({ message: 'Deleted' });
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
