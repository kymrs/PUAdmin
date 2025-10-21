const { Aksessubmenu, Submenu } = require("../models");
const { Op } = require("sequelize");

module.exports = async (req, res, next) => {
  try {
    const user = req.session.user;

    if (!user) {
      res.locals.akses = {
        view_level: 'N',
        add_level: 'N',
        edit_level: 'N',
        delete_level: 'N',
        print_level: 'N',
        upload_level: 'N',
      };
      return next();
    }

    // Ambil path penuh (bukan hanya bagian terakhir)
    let currentPath = req.baseUrl.replace(/^\/api/, "");
    if (!currentPath.startsWith("/")) {
      currentPath = "/" + currentPath;
    }

    // ambil semua hak akses submenu berdasarkan level user
    const aksesList = await Aksessubmenu.findAll({
      where: { id_level: user.id_level },
      include: {
        model: Submenu,
        attributes: ["link"],
        where: {
          is_active: 'Y',
        },
      },
    });

    // mapping: { '/path/to/page': { view_level: 'Y', ... } }
   // mapping: { '/path/to/page': { view_level: 'Y', ... } }
    const aksesSubmenu = {};
    aksesList.forEach((item) => {
      if (item.Submenu && item.Submenu.link) {
        aksesSubmenu[item.Submenu.link] = {
          view_level: item.view_level,
          add_level: item.add_level,
          edit_level: item.edit_level,
          delete_level: item.delete_level,
          print_level: item.print_level,
          upload_level: item.upload_level,
        };
      }
    });

    // Cari akses paling cocok berdasarkan currentPath
    let akses = null;
    let maxMatchLength = 0;

    for (const [link, aksesData] of Object.entries(aksesSubmenu)) {
      if (currentPath.includes(link) && link.length > maxMatchLength) {
        akses = aksesData;
        maxMatchLength = link.length;
      }
    }

    if (!akses) {
      akses = {
        view_level: 'N',
        add_level: 'N',
        edit_level: 'N',
        delete_level: 'N',
        print_level: 'N',
        upload_level: 'N',
      };
    }


    // Inject
    res.locals.akses = akses;
    res.locals.username = user.username || null;
    res.locals.fullname = user.fullname || null;
    res.locals.id_level = user.id_level || null;

    // Log
    // console.log("current path:", currentPath);
    // console.log("akses:", akses);

    next();
  } catch (error) {
    console.error("Error in injectUser middleware:", error);
    next(error);
  }
};
