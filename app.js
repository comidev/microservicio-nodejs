require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./app/routes/index");
const { dbConnect } = require("./config/mongo");
const { handleGeneralError } = require("./app/middleware/handleError");
const { error404 } = require("./app/middleware/404");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("", routes);

app.use(error404);
app.use(handleGeneralError);

dbConnect();
const server = app.listen(PORT, () => {
    console.log("Port start :v ", PORT);
});

module.exports = { app, server };
