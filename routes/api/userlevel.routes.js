const express = require("express");
const userlevelController = require("../../controllers/api/userlevel.controller");
const { injectUser } = require("../../middleware/");

const router = express.Router();

router.get("/", userlevelController.getAllUserlevel);
router.get("/datatables", injectUser, userlevelController.getAllUserlevelDatatables);
router.get("/by-level/:id_level", injectUser, userlevelController.getUserAksesByLevel);
router.get("/:id", userlevelController.getUserlevelById);
router.post("/", userlevelController.createUserlevel);
router.post("/upsert-access", injectUser, userlevelController.upsertAccess);
router.put("/:id", userlevelController.updateUserlevel);
router.delete("/:id", userlevelController.deleteUserlevel);

module.exports = router;
