const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController')

router.get('/findByUserId/:uid', (req, res) => {
  todoController.findByUserId(req, res);
});

router.get('/findById/:id', (req, res) => {
  todoController.findById(req, res);
});

router.get('/findByStatus/:status', (req, res) => {
  todoController.findByStatus(req, res);
});

router.get('/findByType/:type', (req, res) => {
  todoController.findByType(req, res);
});

router.post('/', (req, res) => {
  todoController.addTodoItem(req, res);
});

router.put('/:id', (req, res) => {
  todoController.updateTodoItem(req, res);
});

router.delete('/:todoId', (req, res) => {
  todoController.deleteTodoItem(req, res);
});

module.exports = router;
