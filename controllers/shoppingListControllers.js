const ShoppingList = require('../models/shoppingList');

// CREATE a new shopping list item
addListItem = async (req, res) => {
  try {
    const { id, name, quantity } = req.body;
    const shoppingListItem = await ShoppingList.create({ id, name, quantity });
    res.status(201).json(shoppingListItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// READ all shopping list items
getAllListItems = async (req, res) => {
  try {
    const shoppingListItems = await ShoppingList.find();
    res.json(shoppingListItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// READ a single shopping list item by ID
getListItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const shoppingListItem = await ShoppingList.findOne({ id });
    if (!shoppingListItem) {
      return res.status(404).json({ message: 'Shopping list item not found' });
    }
    res.json(shoppingListItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE a shopping list item by ID
updateListItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const updatedShoppingListItem = await ShoppingList.findOneAndUpdate(
      { id },
      { name, quantity, updated: new Date() },
      { new: true }
    );
    if (!updatedShoppingListItem) {
      return res.status(404).json({ message: 'Shopping list item not found' });
    }
    res.json(updatedShoppingListItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE a shopping list item by ID
deleteListItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShoppingListItem = await ShoppingList.findOneAndDelete({ id });
    if (!deletedShoppingListItem) {
      return res.status(404).json({ message: 'Shopping list item not found' });
    }
    res.json(deletedShoppingListItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addListItem,
  getAllListItems,
  getListItemById,
  updateListItemById,
  deleteListItemById,
};