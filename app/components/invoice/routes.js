const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("", controller.save);
router.post("", controller.findAll);
router.post("/:id", controller.findById);

module.exports = router;
