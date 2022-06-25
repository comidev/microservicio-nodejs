const controller = require("./controller");
const express = require("express");
const router = express.Router();

router.get("", controller.findAll);
router.get("/:id", controller.findById);
router.post("", controller.save);
router.post("/regions", controller.saveRegion);
router.delete("/:id", controller.deleteById);

module.exports = router;
