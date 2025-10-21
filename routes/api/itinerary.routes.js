const express = require('express');
const itineraryController = require('../../controllers/api/itinerary.controller');
const { injectUser } = require('../../middleware');
const router = express.Router();

router.get("/", itineraryController.getAllItineraries);
router.get("/:id", itineraryController.getItineraryById);
router.post("/", injectUser, itineraryController.createItinerary);
router.put("/:id", injectUser, itineraryController.updateItinerary);
router.delete("/:id", injectUser, itineraryController.deleteItinerary);

module.exports = router;