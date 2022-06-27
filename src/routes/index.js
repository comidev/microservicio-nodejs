const products = require("../app/routes/product");
const categories = require("../app/routes/category");
const users = require("../app/routes/user");
const customers = require("../app/routes/customer");
const invoices = require("../app/routes/invoice");

const express = require("express");
const router = express.Router();

router.use("/products", products);
router.use("/categories", categories);
router.use("/users", users);
router.use("/customers", customers);
router.use("/invoices", invoices);

module.exports = router;
