const express = require('express');
const facilitiesController = require('../../../controllers/api/facilities/facility.controller');
const { injectUser } = require('../../../middleware');
const router = express.Router();

router.get("/", facilitiesController.getAllFacilities);
router.get("/:id", facilitiesController.getFacilityById);
router.post("/", injectUser, facilitiesController.createFacility);
router.put("/:id", injectUser, facilitiesController.updateFacility);
router.delete("/:id", injectUser, facilitiesController.deleteFacility);

module.exports = router;