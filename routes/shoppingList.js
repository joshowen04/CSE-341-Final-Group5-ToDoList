const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListControllers');

// // CREATE a new shopping list item
// router.post('/', shoppingListController.create);

// // READ all shopping list items
// router.get('/', shoppingListController.getAll);

// // READ a single shopping list item by ID
// router.get('/:id', shoppingListController.getById);

// // UPDATE a shopping list item by ID
// router.patch('/:id', shoppingListController.updateById);

// // DELETE a shopping list item by ID
// router.delete('/:id', shoppingListController.deleteById);

// module.exports = router;

// CREATE a new shopping list item
router.post('/shopping-list', (req, res) => {
  res.status(201).send('This works');
});

// READ all shopping list items
router.get('/shopping-list', (req, res) => {
  res.status(201).send('This works');
});

// READ a single shopping list item by ID
router.get('/shopping-list/:id', (req, res) => {
  res.status(201).send('This works');
});

// UPDATE a shopping list item by ID
router.put('/shopping-list/:id', (req, res) => {
  res.status(201).send('This works');
});

// DELETE a shopping list item by ID
router.delete('/shopping-list/:id', (req, res) => {
  res.status(201).send('This works');
});

module.exports = router;
