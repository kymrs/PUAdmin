const express = require("express");
const router = express.Router();
const { auth, loadSidebar, loadNotification } = require("../../middleware");
const umrahPackage = require("../../services/umrahPackage.service");

// TAMPILAN LIST
router.get("/", auth.ensureAuth, loadSidebar, loadNotification, async (req, res) => {
  try {
    const packages = await umrahPackage.getAllUmrahPackages();

    res.render("home", {
      link: "umrahPackage/umrahPackage_list",
      jslink: "javascripts/umrahPackage_javascript.js",
      user: req.session.user,
      username: req.session.user?.username || "Guest",
      fullname: req.session.user?.fullname || "Guest",
      packages
    });
  } catch (error) {
    console.error("❌ Error loading travels:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// // TAMPILAN FORM
// router.get("/form", auth.ensureAuth, loadSidebar, async (req, res) => {
//   res.render("home", {
//     link: "galleries/gallery_form",
//     jslink: "javascript/gallery_javascript.js",
//     user: req.session.user,
//     username: req.session.user?.username || "Guest",
//     fullname: req.session.user?.fullname || "Guest",
//   });
// });


module.exports = router;
