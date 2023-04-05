const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth');
}

app
  .use(express.json())
  .use(cors())
  .use(
    session({
      secret: crypto.randomBytes(32).toString('base64'),
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(passport.initialize(undefined))
  .use(passport.session(undefined))
  .use('/auth', require('./routes/auth'))
  .use('/user', isAuthenticated, require('./routes/userRoutes'))
  .use('/shoppingList', isAuthenticated, require('./routes/shoppingList'))
  .use('/inventory', isAuthenticated, require('./routes/inventory'))
  .use('/todo', isAuthenticated, require('./routes/todo'))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });

module.exports = app;