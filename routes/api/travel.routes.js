const express = require("express");
const travelController = require("../../controllers/api/travel.controller"); // Pastikan path ini benar
const { injectUser } = require("../../middleware");

const router = express.Router();

router.get("/", travelController.getAllTravels);
router.get("/by-category", travelController.getTravelsByCategory);
router.get("/datatables", injectUser, travelController.getAllTravelsDatatables);
router.get("/:id", travelController.getTravelById);
router.post("/", travelController.createTravel);
router.put("/:id", travelController.updateTravel);
router.delete("/:id", travelController.deleteTravel);

module.exports = router;
