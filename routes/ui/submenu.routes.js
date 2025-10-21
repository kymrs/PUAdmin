const express = require("express");
const router = express.Router();
const { auth, loadSidebar, loadNotification } = require("../../middleware");
const SubmenuService = require("../../services/submenu.service");
const MenuService = require("../../services/menu.service");

// TAMPILAN LIST
router.get("/", auth.ensureAuth, loadSidebar, loadNotification, async (req, res) => {
    try {
        const submenu = await SubmenuService.getAllSubmenu();
        const menu = await MenuService.getAllMenu();

        res.render("home", {
            link: "submenu/submenu_list",
            jslink: "javascripts/subMenu_javascript.js",
            user: req.session.user,
            username: req.session.user?.username || "Guest",
            fullname: req.session.user?.fullname || "Guest",
            submenu,
            menu
        });        
    } catch (error) {
        console.error("❌ Error loading users", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;