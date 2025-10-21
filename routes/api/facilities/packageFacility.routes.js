const express = require('express');
const PackageFacilityController = require('../../../controllers/api/facilities/packageFacility.controller');
const { injectUser } = require('../../../middleware');
const router = express.Router();

router.get("/", PackageFacilityController.getAllPackageFacilities);
router.get("/:id", PackageFacilityController.getPackageFacilityById);
router.post("/", injectUser, PackageFacilityController.createPackageFacility);
router.put("/:id", injectUser, PackageFacilityController.updatePackageFacility);
router.delete("/:id", injectUser, PackageFacilityController.deletePackageFacility);

module.exports = router;