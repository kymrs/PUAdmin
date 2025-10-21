const express = require('express');
const umrahPackageController = require('../../controllers/api/umrahPackage.controller');
const { injectUser } = require('../../middleware');
const router = express.Router();

router.get("/", umrahPackageController.getAllUmrahPackages);
router.get("/datatables", injectUser, umrahPackageController.getAllUmrahPackageDatatables);
router.get("/:id", umrahPackageController.getUmrahPackageById);
router.post("/", umrahPackageController.createUmrahPackage);
router.put("/:id", umrahPackageController.updateUmrahPackage);
router.delete("/:id", umrahPackageController.deleteUmrahPackage);

module.exports = router;