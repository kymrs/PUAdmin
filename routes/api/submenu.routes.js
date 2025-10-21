const express = require("express");
const submenuController = require("../../controllers/api/submenu.controller");
const { injectUser } = require("../../middleware");

const router = express.Router();

router.get("/", submenuController.getAllSubmenu);
router.get("/datatables", injectUser, submenuController.getAllSubmenuDatatables);
router.get("/:id", submenuController.getSubmenuById);
router.post("/", submenuController.createSubmenu);
router.put("/:id", submenuController.updateSubmenu);
router.delete("/:id", submenuController.deleteSubmenu);

module.exports = router;
