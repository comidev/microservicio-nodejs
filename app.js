require("dotenv").config();
const { dbConnectMongoDB } = require("./src/config/mongo");
const { dbConnectMySQL } = require("./src/config/mysql");

const express = require("express");
const cors = require("cors");
const routes = require("./src/routes/index");

const { handleGeneralError } = require("./src/app/middleware/handleError");
const { error404 } = require("./src/app/middleware/404");

const app = express();
const PORT = process.env.PORT || 3000;
const { ENGINE_DB } = process.env;

app.use(cors());
app.use(express.json());

app.use("", routes);

app.use(error404);
app.use(handleGeneralError);

ENGINE_DB === "mongodb" ? dbConnectMongoDB() : dbConnectMySQL();

const server = app.listen(PORT, () => {
    console.log("Port start :v ", PORT);
});

module.exports = { app, server };
