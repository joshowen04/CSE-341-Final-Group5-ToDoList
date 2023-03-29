// 'use strict';
// module.exports = function (app) {
//   const users = require('../controllers/userController');
//   const swaggerUi = require('swagger-ui-express');
//   const swaggerDocument = require('../swagger.json');
//   app.use(swaggerUi.serve);

//   app.route('/users').get(users.list_all_users).post(users.create_user);
//   app.route('/api-docs').get(swaggerUi.setup(swaggerDocument));

//   app
//     .route('/users/:userId')
//     .get(users.read_user)
//     .put(users.update_user)
//     .delete(users.delete_user);
// };



const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');


router.get('/users', (req, res) => {
  users.list_all_users(req, res);
});

router.get('/users/:userId', (req, res) => {
  users.read_user(req, res);
});

router.post('/users', (req, res) => {
  users.create_user(req, res);
});

router.put('/users/:userId', (req, res) => {
  users.update_user(req, res);
});

router.delete('/users/:userId', (req, res) => {
  users.delete_user(req, res);
});

module.exports = router;