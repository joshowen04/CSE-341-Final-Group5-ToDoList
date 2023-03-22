const Inventory = require('../models/inventory');
const mongoose = require('mongoose');

exports.getAllInvItems = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
    Inventory.find().then((inv) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(inv);
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getInvById = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Inventory.find({ _id: req.params.invId }).then((inv) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(inv);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.createInvItem = function (req, res) {
  try {
    const item = {
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      minimumQuantity: req.body.minimumQuantity
    };
    const allFieldsExist =
      item.name && item.description && item.quantity && item.minimumQuantity;

    if (!allFieldsExist) {
      res.status(400).json('All fields must be filled out.');
      return;
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    const newInventory = new Inventory(item);
    // Save the new document to the database
    newInventory
      .save({ new: true })
      .then((inv) => {
        res.status(201).json(inv._id);
      })
      .catch((error) => {
        res
          .status(500)
          .json(
            error ||
              'Some error occurred while creating the new inventory item.'
          );
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateInvItem = (req, res) => {
  try {
    const item = {
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      minimumQuantity: req.body.minimumQuantity
    };

    const allFieldsExist =
      item.name && item.description && item.quantity && item.minimumQuantity;

    if (!allFieldsExist) {
      res.status(400).json('All fields must be filled out.');
      return;
    }
    if (req.params.invId.length !== 24) {
      res.status(400).json('Invalid ID.');
      return;
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Inventory.findByIdAndUpdate({ _id: req.params.invId }, item, {
      new: true
    }).then((result) => {
      if (result) {
        res.status(204).json(item);
      } else {
        res.status(404).json('Item not found');
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteInvItem = function (req, res) {
  try {
    if (req.params.invId.length !== 24) {
      res.status(400).json('Invalid ID.');
      return;
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    Inventory.findByIdAndRemove({ _id: req.params.invId }).then(
      (error, inv) => {
        if (error) {
          res.status(500).json(error);
        } else if (inv.deletedCount === 0) {
          res.status(404).json({ message: 'Todo Item not found.' });
        } else {
          res.status(204).json({ message: 'Inventory Item Deleted' });
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
