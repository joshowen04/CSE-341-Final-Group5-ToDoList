const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');

router.get('/', (req, res) => {
  invController.getAllInvItems(req, res);
});
router.get('/:invId', (req, res) => {
  invController.getInvById(req, res);
});
router.post('/', (req, res) => {
  invController.createInvItem(req, res);
});
router.put('/:invId', (req, res) => {
  invController.updateInvItem(req, res);
});

router.delete('/:invId', (req, res) => {
  invController.deleteInvItem(req, res);
});

module.exports = router;
