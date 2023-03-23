const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');

// Import the shopping list controller functions
const {
  getShoppingList,
  getShoppingListItemById,
  createShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
} = require('../controllers/shoppingListController');

// Define routes for shopping list CRUD operations
router.post('/shoppingList', createShoppingListItem);
router.get('/shoppingList', getShoppingList);
router.get('/shoppingList/:id', getShoppingListItemById);
router.put('/shoppingList/:id', updateShoppingListItem);
router.delete('/shoppingList/:id', deleteShoppingListItem);

module.exports = router;
