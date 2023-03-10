const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingList');

// CREATE a new shopping list item
router.post('/', shoppingListController.create);

// READ all shopping list items
router.get('/', shoppingListController.getAll);

// READ a single shopping list item by ID
router.get('/:id', shoppingListController.getById);

// UPDATE a shopping list item by ID
router.patch('/:id', shoppingListController.updateById);

// DELETE a shopping list item by ID
router.delete('/:id', shoppingListController.deleteById);

module.exports = router;