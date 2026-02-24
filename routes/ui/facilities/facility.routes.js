const express = require("express");
const router = express.Router();
const FacilityService = require("../../../services/facilities/facility.service");
const { auth, loadSidebar, loadNotification } = require("../../../middleware");


// TAMPILAN CREATE FACILITY
router.get("/", auth.ensureAuth, loadSidebar, loadNotification, async (req, res) => {
    try{
        const getFacilities = await FacilityService.getAllFacilities() ?? [];

        res.render("home", {
            link: "facilities/facility_list",
            jslink: "/javascripts/facility_javascripts.js",
            sideBarMenus: res.locals.sideBarMenus,
            activeMenu: req.path,
            user: req.session.user,
            username: req.session.user?.username || "Guest",
            fullname: req.session.user?.fullname || "Guest",
            getFacilities
        });
        console.log('SESSION USER:', req.session.user);
    } catch (error) {
        console.log("❌ Error loading create product page:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;