const products = require("../components/product/routes");
const categories = require("../components/category/routes");

const express = require("express");
const router = express.Router();

router.use("/products", products);
router.use("/categories", categories);

module.exports = router;
