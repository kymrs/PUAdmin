const express = require('express');
const hotelController = require('../../../controllers/api/hotels/hotel.controller');
const { injectUser } = require('../../../middleware');
const router = express.Router();

router.get("/", hotelController.getAllHotels);
router.get("/datatables", injectUser, hotelController.getAllHotelDatatables);
router.get("/:id", hotelController.getHotelById);
router.post("/", hotelController.createHotel);
router.put("/:id", hotelController.updateHotel);
router.delete("/:id", hotelController.deleteHotel);

module.exports = router;