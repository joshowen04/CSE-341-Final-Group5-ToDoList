const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');


router.get('/', (req, res) => {
  users.list_all_users(req, res);
});

router.get('/:userId', (req, res) => {
  users.read_user(req, res);
});

router.post('/', (req, res) => {
  users.create_user(req, res);
});

router.put('/:userId', (req, res) => {
  users.update_user(req, res);
});

router.delete('/:userId', (req, res) => {
  users.delete_user(req, res);
});

module.exports = router;