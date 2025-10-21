const express = require("express");
const router = express.Router();
const { auth, loadSidebar, loadNotification } = require("../../middleware");
const TravelReviews = require("../../services/travelreviews.service");
const TravelService = require("../../services/travel.service");

// TAMPILAN LIST
router.get("/", auth.ensureAuth, loadSidebar, loadNotification, async (req, res) => {
  try {
    const travelReviews = await TravelReviews.getAllTravelReviews();
    const travels = await TravelService.getAllTravels(); // Ambil semua data travel

    res.render("home", {
      link: "travelreviews/travelreviews_list",
      jslink: "javascripts/travelreviews_javascript.js",
      user: req.session.user,
      username: req.session.user?.username || "Guest",
      fullname: req.session.user?.fullname || "Guest",
      travelReviews,
      travels
    });
  } catch (error) {
    console.error("❌ Error loading travel reviews:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
