const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("", controller.findAll);
router.get("/:id", controller.findById);
router.post("", controller.save);

module.exports = router;
