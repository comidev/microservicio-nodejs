const controller = require("./controller");
const express = require("express");
const router = express.Router();

router.get("/:id", controller.findById);
router.get("", controller.findAll);
router.post("", controller.save);

module.exports = router;
