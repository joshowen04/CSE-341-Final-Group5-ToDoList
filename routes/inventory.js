'use strict';
module.exports = function (app) {
  const inv = require('../controllers/inventoryController.js');
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('../swagger.json');
  app.use(swaggerUi.serve);

  app
    .route('/inventory')
    .get(inv.list_all)
    .post(inv.create_inv);

  app
    .route('/inv/:invId')
    .get(inv.read_inv)
    .put(inv.update_inv)
    .delete(inv.delete_inv);
  
  app.route('/api-docs').get(swaggerUi.setup(swaggerDocument));

  
};



// POST /inventory/
// GET /inventory
// GET /inventory/{inventoryId}
// PUT /inventory/{inventoryId}
// DELETE inventory/{inventoryId}
