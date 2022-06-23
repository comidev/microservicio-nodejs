require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./app/routes/index");
const { dbConnect } = require("./config/mongo");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("", routes);

dbConnect();
const server = app.listen(PORT, () => {
    console.log("Port start :v ", PORT);
});

module.exports = { app, server };
