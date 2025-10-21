const express = require("express");
const router = express.Router();
const { auth, loadSidebar, loadNotification } = require("../../middleware");
const MenuService = require("../../services/menu.service");

// TAMPILAN LIST
router.get("/", auth.ensureAuth, loadSidebar, loadNotification, async (req, res) => {
    try {
        const menu = await MenuService.getAllMenu();

        res.render("home", {
            link: "menu/menu_list",
            jslink: "javascripts/menu_javascript.js",
            user: req.session.user,
            username: req.session.user?.username || "Guest",
            fullname: req.session.user?.fullname || "Guest",
            menu
        });  
    } catch (error) {
        console.log("❌ Error loading gallery:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;