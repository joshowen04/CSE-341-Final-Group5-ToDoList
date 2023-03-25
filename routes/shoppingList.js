const express = require('express');
const router = express.Router();

// Import the shopping list controller functions
const {
  getShoppingList,
  getShoppingListItemById,
  createShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
} = require('../controllers/shoppingListController');

// Define routes for shopping list CRUD operations
router.post('/', createShoppingListItem);
router.get('/', getShoppingList);
router.get('/:id', getShoppingListItemById);
router.put('/:id', updateShoppingListItem);
router.delete('/:id', deleteShoppingListItem);

module.exports = router;
