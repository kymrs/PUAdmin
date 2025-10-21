const express = require("express");
const router = express.Router();
const { auth, loadSidebar, loadNotification } = require("../../middleware");
const UserService = require("../../services/user.service");
const UserlevelService = require("../../services/userlevel.service");
const AksesmenuService = require("../../services/aksesmenu.service");
const AksessubmenuService = require("../../services/aksessubmenu.service");

router.get("/", auth.ensureAuth, loadSidebar, loadNotification, async (req, res) => {
    try {
        const userlevel = await UserlevelService.getAllUserlevel();
        const users = await UserService.getAllUsers();

        res.render("home", {
            link: "userlevel/userlevel_list",
            jslink: "javascripts/userlevel_javascript.js",
            jslink2: "javascripts/userAkses_javascript.js",
            user: req.session.user,
            username: req.session.user?.username || "Guest",
            fullname: req.session.user?.fullname || "Guest",
            userlevel,
            users
        });
    } catch (error) {
        console.error("❌ Error loading userlevel", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/userAkses/:id_level", auth.ensureAuth, loadSidebar, async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        const idLevelUser = req.session.user.id_level;
        const aksesMenu = await AksesmenuService.getAksesmenuByLevel(idLevelUser);
        const aksesSubmenu = await AksessubmenuService.getAksessubmenuByLevel(idLevelUser);
        const userlevel = await UserlevelService.getAllUserlevel();

        // console.log("AKSES MENU:");
        //     aksesmenu.forEach((item) => {
        //     console.log("->", item.Menu?.nama_menu);
        //     });

        // console.log(aksesSubmenu);

        res.render("home", {
            link: "userlevel/userAkses",
            jslink: "javascripts/javascript.js",
            user: req.session.user,
            username: req.session.user?.username || "Guest",
            fullname: req.session.user?.fullname || "Guest",
            users,
            aksesMenu,
            aksesSubmenu,
            userlevel
        });
    } catch (error) {
        console.error("❌ Error loading userakses", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;