const categoryController = require("./controller");
const express = require("express");
const router = express.Router();

router.get("/:id", categoryController.findById);
router.get("", categoryController.findAll);
router.post("", categoryController.save);

module.exports = router;
