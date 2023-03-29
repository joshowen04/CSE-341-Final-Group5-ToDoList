// const mongoose = require('mongoose');
// const User = mongoose.model('Users');

const User = require('../models/users');
const mongoose = require('mongoose');

// exports.list_all_users = function (req, res) {
//   try {
//     User.find({}, function (err, user) {
//       if (err) res.send(err);
//       res.json(user);
//     });
//   } catch (error) {
//     console.error(error);
//     // Expected output: ReferenceError: nonExistentFunction is not defined
//     // (Note: the exact output may be browser-dependent)
//   }
// };

// exports.create_user = function (req, res) {
//   console.log('create_user function');
//   const user = {
//     userName: req.body.userName
//     //, userId: req.body.userId
//   };
//   const new_user = new User(user);
//   new_user.save(function (err, user) {
//     if (err) res.send(err);
//     res.status(201).json(user['_id']);
//     // res.json(contact);
//   });
// };

// exports.update_user = function (req, res) {
//   let user = {
//     userName: null
//     //, userId: null
//   };
//   for (parameter in req.body) {
//     //console.log(req.body[`${parameter}`]);
//     user[parameter] = req.body[`${parameter}`];
//     //console.log(item);
//   }
//   let validated = true;
//   for (value in user) {
//     if (user[value] === null) {
//       validated = false;
//       break;
//     }
//   }
//   if (validated) {
//     User.findOneAndUpdate(
//       { _id: req.params.userId },
//       user,
//       { new: true },
//       function (err, user) {
//         if (err) res.send(err);
//         res.status(204).json({ message: 'Item successfully updated' });
//       }
//     );
//   } else {
//     res
//       .status(400)
//       .json('Please make sure to provide all of the required values');
//   }
// };

// exports.read_user = function (req, res) {
//   User.findById(req.params.userId, function (err, user) {
//     if (err) res.send(err);
//     res.json(user);
//   });
// };

// exports.delete_user = function (req, res) {
//   User.deleteOne({ _id: req.params.userId }, function (err, user) {
//     if (err) {
//       res.send(err);
//     } else {
//       if (user.deletedCount == 0) {
//         res.status(400).json({ message: 'No user exists with that ID' });
//       } else {
//         res.status(200).json({ message: 'User successfully deleted' });
//       }
//     }
//   });
// };


exports.list_all_users = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
    User.find().then((inv) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(inv);
    });
  } catch (error) {
    console.error(error);
  }
};

exports.read_user = function (req, res) {
  try {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    User.find({ _id: req.params.userId }).then((usr) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(usr);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.create_user = function (req, res) {
  try {
    const user = {
      userName: req.body.userName
    };
    const allFieldsExist = user.userName;

    if (!allFieldsExist) {
      res.status(400).json('All fields must be filled out.');
      return;
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    const newUser = new User(user);
    // Save the new document to the database
    newUser
      .save({ new: true })
      .then((usr) => {
        res.status(201).json(usr._id);
      })
      .catch((error) => {
        res
          .status(500)
          .json(
            error ||
              'Some error occurred while creating the new User.'
          );
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.update_user = (req, res) => {
  try {
    const user = {
      userName: req.body.userName
    };

    const allFieldsExist = user.userName;

    if (!allFieldsExist) {
      res.status(400).json('All fields must be filled out.');
      return;
    }
    if (req.params.userId.length !== 24) {
      res.status(400).json('Invalid ID.');
      return;
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    User.findByIdAndUpdate({ _id: req.params.userId }, user, {
      new: true
    }).then((result) => {
      if (result) {
        res.status(204).json(user);
      } else {
        res.status(404).json('User not found');
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.delete_user = function (req, res) {
  try {
    if (req.params.userId.length !== 24) {
      res.status(400).json('Invalid ID.');
      return;
    }
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    User.findByIdAndRemove({ _id: req.params.userId }).then(
      (error, usr) => {
        if (error) {
          res.status(500).json(error);
        } else if (usr.deletedCount === 0) {
          res.status(404).json({ message: 'User not found.' });
        } else {
          res.status(204).json({ message: 'User Deleted' });
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};