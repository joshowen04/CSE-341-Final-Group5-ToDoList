const mongoose = require('mongoose');
const ShoppingListItem = require('../models/shoppingList');

exports.getShoppingList = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    ShoppingListItem.find()
      .then(shoppingList => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(shoppingList);
      })
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getShoppingListItemById = function (req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid id' });
  }

  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    ShoppingListItem.findById(id)
      .then(shoppingListItem => {
        if (!shoppingListItem) {
          return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(shoppingListItem);
      })
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createShoppingListItem = function (req, res) {
  const { name, quantity } = req.body;
  console.log(`Creating shopping list item with name: ${name} and quantity: ${quantity}`);

  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    const newShoppingListItem = new ShoppingListItem({ name, quantity });

    newShoppingListItem.save()
      .then(savedShoppingListItem => {
        console.log('Created shopping list item:', savedShoppingListItem);
        res.status(201).json(savedShoppingListItem);
      })
  } catch (error) {
    res.status(409).json(error);
  }
};

exports.updateShoppingListItem = function (req, res) {
  const { id } = req.params;
  const { name, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid id' });
  }

  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    ShoppingListItem.findByIdAndUpdate(
      id,
      { name, quantity, updated: new Date() },
      { new: true }
    )
      .then(updatedShoppingListItem => {
        if (!updatedShoppingListItem) {
          return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(updatedShoppingListItem);
      })
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteShoppingListItem = function (req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid id' });
  }

  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    ShoppingListItem.findByIdAndRemove(id)
      .then(deletedShoppingListItem => {
        if (!deletedShoppingListItem) {
          return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
      })
  } catch (error) {
    res.status(500).json(error);
  }
};