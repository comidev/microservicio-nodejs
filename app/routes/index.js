const products = require("../components/product/routes");
const categories = require("../components/category/routes");
const users = require("../components/user/routes");
const customers = require("../components/customer/routes");
const invoices = require("../components/invoice/routes");

const express = require("express");
const router = express.Router();

router.use("/products", products);
router.use("/categories", categories);
router.use("/users", users);
router.use("/customers", customers);
router.use("/invoices", invoices);

module.exports = router;
