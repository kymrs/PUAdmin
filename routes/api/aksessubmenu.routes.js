const express = require("express");
const aksessubmenuController = require("../../controllers/api/aksessubmenu.controller");

const router = express.Router();

router.get("/", aksessubmenuController.getAllAksessubmenu);
router.get("/:id", aksessubmenuController.getAksessubmenuById);
router.post("/", aksessubmenuController.createAksessubmenu);
router.put("/:id", aksessubmenuController.updateAksessubmenu);
router.delete("/:id", aksessubmenuController.deleteAksessubmenu);

module.exports = router;
