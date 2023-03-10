const path = require('path');
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();

const Users = require('./models/users.js'); //created model loading here
const Inventory = require('./models/inventory.js');
const ShoppingList = require('./models/shoppingList.js'); //created model loading here
const Todo = require('./models/todo.js');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app
  .use(express.json())
  .use(cors())
  .use('/user', require('./routes/userRoutes'))
  .use('/shoppingList', require('./routes/shoppingList'))
  .use('/inventory', require('./routes/inventory'))
  .use('/todo', require('./routes/todo'))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });
