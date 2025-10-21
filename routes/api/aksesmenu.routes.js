const express = require("express");
const aksesmenuController = require("../../controllers/api/aksesmenu.controller");

const router = express.Router();

router.get("/", aksesmenuController.getAllAksesmenu);
router.get("/:id", aksesmenuController.getAksesmenuById);
router.post("/", aksesmenuController.createAksesmenu);
router.put("/:id", aksesmenuController.updateAksesmenu);
router.delete("/:id", aksesmenuController.deleteAksesmenu);

module.exports = router;
