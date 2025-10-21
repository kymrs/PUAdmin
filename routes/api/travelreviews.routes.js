const express = require("express");
const travelReviewsController = require("../../controllers/api/travelreviews.controller");
const { injectUser } = require("../../middleware");

const router = express.Router();

// Endpoint CRUD
router.get("/", travelReviewsController.getAllTravelReviews);
router.get("/datatables", injectUser, travelReviewsController.getAllTravelReviewsDatatables);
router.get("/:id", travelReviewsController.getTravelReviewsById);
router.post("/", travelReviewsController.createTravelReviews);
router.put("/:id", travelReviewsController.updateTravelReviews);
router.delete("/:id", travelReviewsController.deleteTravelReviews);

module.exports = router;
