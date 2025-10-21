const express = require("express");
const menuController = require("../../controllers/api/menu.controller");
const { injectUser } = require("../../middleware/");

const router = express.Router();

router.get("/", menuController.getAllMenu);
router.get("/datatables", injectUser, menuController.getAllMenuDatatables);
router.get("/:id", menuController.getMenuById);
router.post("/", menuController.createMenu);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

module.exports = router;
