const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mongoStore = new MongoStore({
  mongoUrl: process.env.MONGODB_URL,
  collectionName: 'sessions'
});

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth');
}

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
const PORT = process.env.PORT || 3000;

app
  .use(express.json())
  .use(cors())
  .use(cookieParser())
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: mongoStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: true,
        secure: process.env.ENVIRONMENT === 'production' // cookies over https only when in production
      }
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