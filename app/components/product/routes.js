const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.get("", controller.findAll);
router.get("/:id", controller.findById);
router.post("", controller.save);
router.delete("", controller.deleteById);

module.exports = router;
