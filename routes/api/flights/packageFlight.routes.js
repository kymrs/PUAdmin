const express = require('express');
const packageFlightController = require('../../../controllers/api/flights/packageFlight.controller');
const { injectUser } = require('../../../middleware');
const router = express.Router();

router.get("/", packageFlightController.getAllPackageFlights);
router.get("/:id", packageFlightController.getPackageFlightById);
router.post("/", injectUser, packageFlightController.createPackageFlight);
router.put("/:id", injectUser, packageFlightController.updatePackageFlight);
router.delete("/:id", injectUser, packageFlightController.deletePackageFlight);

module.exports = router;