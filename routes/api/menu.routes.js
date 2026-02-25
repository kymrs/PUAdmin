const express = require("express");
const menuController = require("../../controllers/api/menu.controller");
const submenuController = require("../../controllers/api/submenu.controller");
const { injectUser } = require("../../middleware/");
const { ensureAuth } = require("../../middleware/auth");

const router = express.Router();

router.get("/", menuController.getAllMenu);

router.get("/parent", menuController.getParentsController);
router.get("/parent/datatables", ensureAuth, injectUser, menuController.getParentPaginatedMenu);
router.get("/:id_menu", menuController.getMenuById);

router.get("/submenu", submenuController.getAllSubmenu);
router.get("/submenu/datatables", ensureAuth, injectUser, submenuController.getSubmenuPaginated);

// nested sidebar
router.get("/nested", menuController.getNestedMenu);

router.post("/", menuController.createMenu);
router.put("/:id_menu", menuController.updateMenu);
router.delete("/:id_menu", menuController.deleteMenu);


module.exports = router;
