const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const ShoppingListItem = require('../models/shoppingList');

const getShoppingList = async (req, res) => {
  try {
    const shoppingList = await ShoppingListItem.find();
    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getShoppingListItemById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid id' });
  }

  try {
    const shoppingListItem = await ShoppingListItem.findById(id);

    if (!shoppingListItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(shoppingListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createShoppingListItem = async (req, res) => {
  const { name, quantity } = req.body;

  const newShoppingListItem = new ShoppingListItem({ name, quantity });

  try {
    await newShoppingListItem.save();
    res.status(201).json(newShoppingListItem);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateShoppingListItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid id' });
  }

  try {
    const updatedShoppingListItem = await ShoppingListItem.findByIdAndUpdate(
      id,
      { name, quantity, updated: new Date() },
      { new: true }
    );

    if (!updatedShoppingListItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedShoppingListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteShoppingListItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid id' });
  }

  try {
    const deletedShoppingListItem = await ShoppingListItem.findByIdAndRemove(id);

    if (!deletedShoppingListItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShoppingList,
  getShoppingListItemById,
  createShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
};