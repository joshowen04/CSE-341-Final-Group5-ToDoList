const path = require('path');
const connectDB = require('./config/db');
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json())
    .use(cors())
    .use("/user", require("./routes/userRoutes"))
    .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .listen(PORT, function () {
        console.log(`Listening on port ${PORT}`);
    });
