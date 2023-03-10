const mongoose = require('mongoose');
const Inventory = mongoose.model('Inventory');

// app
// .route('/inventory')
// .get(inv.list_all)
// .post(inv.create_inv);

// app
// .route('/inv/:userId')
// .get(inv.read_inv)
// .put(inv.update_inv)
// .delete(inv.delete_inv);

list_all = function (req, res) {
  try {
    Inventory.find({}, function (err, item) {
      if (err) res.send(err);
      res.json(item);
    });
  } catch (error) {
    console.error(error);
    // Expected output: ReferenceError: nonExistentFunction is not defined
    // (Note: the exact output may be browser-dependent)
  }
};

create_inv = function (req, res) {
  const item = {
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    minimumQuantity: req.body.minimumQuantity,
  };
  const new_item = new Inventory(item);
  new_item.save(function (err, item) {
    if (err) res.send(err);
    res.status(201).json(item['_id']);
    // res.json(contact);
  });
};

update_inv = function (req, res) {
  let item = {
    name: null,
    description: null,
    quantity: null,
    minimumQuantity: null,
  };
  for (parameter in req.body) {
    //console.log(req.body[`${parameter}`]);

    item[parameter] = req.body[`${parameter}`];
    //console.log(item);
  }
  let validated = true;
  for (value in item) {
    if (item[value] === null) {
      validated = false;
      break;
    }
  }
  if (validated) {
    Inventory.findOneAndUpdate(
      { _id: req.params.invId },
      item,
      { new: true },
      function (err, item) {
        if (err) res.send(err);
        res.status(204).json({ message: 'Item successfully updated' });
      }
    );
  } else {
    res.status(400).json('Please make sure to provide all of the required values');
  }
};

read_inv = function (req, res) {
  Inventory.findById(req.params.invId, function (err, item) {
    if (err) res.send(err);
    res.json(item);
  });
};

delete_inv = function (req, res) {
  Inventory.deleteOne({ _id: req.params.invId }, function (err, item) {
    if (err) {
      res.send(err);
    } else {
      if (item.deletedCount == 0) {
        res.status(400).json({ message: 'No user exists with that ID' });
      } else {
        res.status(200).json({ message: 'User successfully deleted' });
      }
    }
  });
};

module.exports = {
  list_all,
  create_inv,
  delete_inv,
  update_inv,
  read_inv,
};
