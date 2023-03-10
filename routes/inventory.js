const inv = require('../controllers/inventoryController.js');

const express = require('express');
const router = express.Router();

router.post('/inventory', (req, res) => {
  res.status(201).send('This works');
});
router.get('/inventory', (req, res) => {
  res.status(201).send('This works');
});
router.get('/inventory', (req, res) => {
  res.status(201).send('This works');
});

router.delete('/inventory/:invId', (req, res) => {
  res.sendStatus(204);
});

router.get('/inventory/:invId', (req, res) => {
  res.status(201).send('This works');
});
router.put('/inventory/:invId', (req, res) => {
  res.status(201).send('This works');
});

module.exports = router;
