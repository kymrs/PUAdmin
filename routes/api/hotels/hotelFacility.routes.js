const express = require('express');
const hotelFacilityController = require('../../../controllers/api/hotels/hotelFacility.controller');
const { injectUser } = require('../../../middleware');

const router = express.Router();

router.get("/", hotelFacilityController.getAllHotelFacilities);
router.get("/:id", hotelFacilityController.getHotelFacilityById);
router.post("/", hotelFacilityController.createHotelFacility);
router.put("/:id", hotelFacilityController.updateHotelFacility);
router.delete("/:id", hotelFacilityController.deleteHotelFacility);

module.exports = router;