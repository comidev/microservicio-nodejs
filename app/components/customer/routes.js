const controller = require("./controller");
const express = require("express");
const router = express.Router();

router.post("", controller.save);
router.post("/regions", controller.saveRegion);
router.delete("/:id", controller.deleteById);
router.get("", controller.findAll);
router.get("/:id", controller.findById);

module.exports = router;
