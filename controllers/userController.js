const mongoose = require('mongoose');
const User = mongoose.model('Users');

list_all_users = function (req, res) {
  try {
    User.find({}, function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
  } catch (error) {
    console.error(error);
    // Expected output: ReferenceError: nonExistentFunction is not defined
    // (Note: the exact output may be browser-dependent)
  }
};

create_user = function (req, res) {
  console.log('create_user function');
  const user = {
    userName: req.body.userName,
    userId: req.body.userId
  };
  const new_user = new User(user);
  new_user.save(function (err, user) {
    if (err) res.send(err);
    res.status(201).json(user['_id']);
    // res.json(contact);
  });
};

update_user = function (req, res) {
  let user = {
    userName: null,
    userId: null
  };
  for (parameter in req.body) {
    //console.log(req.body[`${parameter}`]);

    user[parameter] = req.body[`${parameter}`];
    //console.log(item);
  }
  let validated = true;
  for (value in user) {
    if (user[value] === null) {
      validated = false;
      break;
    }
  }
  if (validated) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      user,
      { new: true },
      function (err, user) {
        if (err) res.send(err);
        res.status(204).json({ message: 'Item successfully updated' });
      }
    );
  } else {
    res
      .status(400)
      .json('Please make sure to provide all of the required values');
  }
};

read_user = function (req, res) {
  User.findById(req.params.userId, function (err, user) {
    if (err) res.send(err);
    res.json(user);
  });
};

delete_user = function (req, res) {
  User.deleteOne({ _id: req.params.userId }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      if (user.deletedCount == 0) {
        res.status(400).json({ message: 'No user exists with that ID' });
      } else {
        res.status(200).json({ message: 'User successfully deleted' });
      }
    }
  });
};

module.exports = {
  list_all_users,
  create_user,
  delete_user,
  update_user,
  read_user,
};
