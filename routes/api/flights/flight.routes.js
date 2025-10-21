const express = require('express');
const flightController = require('../../../controllers/api/flights/flight.controller');
const { injectUser } = require('../../../middleware');
const router = express.Router();

router.get("/", flightController.getAllFlights);
router.get("/datatables", injectUser, flightController.getAllFlightDatatables);
router.get("/:id", flightController.getFlightById);
router.post("/", injectUser, flightController.createFlight);
router.put("/:id", injectUser, flightController.updateFlight);
router.delete("/:id", injectUser, flightController.deleteFlight);

module.exports = router;