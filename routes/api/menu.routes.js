const express = require("express");
const menuController = require("../../controllers/api/menu.controller");
const submenuController = require("../../controllers/api/submenu2.controller");
const { injectUser } = require("../../middleware/");

const router = express.Router();

router.get("/", menuController.getAllMenu);
router.get("/submenu", submenuController.getAllSubmenu);
router.get("/parent", menuController.getParentsController);
router.get("/nested", menuController.getNestedMenu);
router.post("/nested", menuController.createNestedMenu);
router.get("/:id", menuController.getMenuById);
router.post("/", menuController.createMenu);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

module.exports = router;
