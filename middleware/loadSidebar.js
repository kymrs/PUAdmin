const { Menu, Aksesmenu } = require('../models');
const menuService = require('../services/menu.service');


const buildTree = (menus, parentId = null) => {
      return menus
        .filter(menu => menu.parent_id === parentId)
        .map(menu => ({
          id_menu: menu.id_menu,
          nama_menu: menu.nama_menu,
          icon: menu.icon,
          link: menu.link,
          urutan: menu.urutan,
          is_active: menu.is_active,
          children: buildTree(menus, menu.id_menu)
        }))
      .sort((a, b) => a.urutan - b.urutan);
    }

const findActiveMenu = (menus, currentUrl) => {
  for (const menu of menus) {
    if(currentUrl.startsWith(menu.link)) {
      return menu;
    }
    if(menu.children && menu.children.length > 0) {
      const activeChild = findActiveMenu(menu.children);
      if(activeChild) {
        return menu;
      }
    }
  }
  return null;
}   

const loadSidebar = async (req, res, next) => {
  try {
    const user = req.session.user;
    if (!user) {
      res.locals.sidebarMenus = [];
      res.locals.activeMenu = null; // Tidak ada menu aktif
      return next();
    }

    const idlevel = user.id_level;

    // Ambil semua menu sesuai hak akses user
    const aksesMenus = await Aksesmenu.findAll({
      where: {
        id_level: idlevel,
        view_level: 'Y', // Pastikan hanya mengambil menu dengan view_level = 'Y'
      },
      include: [
        {
          model: Menu,
          where: { is_active: 'Y' },
          required: true,
          
        },
      ],
      order: [[{ model: Menu }, 'urutan', 'ASC']],
    });

    const rawMenus = await menuService.getAllMenu();
    const menuMap = {};

    rawMenus.forEach(menu => {
      menu.children = [];
      menuMap[menu.id_menu] = menu;
    });

    const menuTree = [];
    rawMenus.forEach(menu => {
      if(menu.parent_id) {
        if(menuMap[menu.parent_id]){
          menuMap[menu.parent_id].children.push(menu);
        }
      } else {
        menuTree.push(menu);
      }
    });

    res.locals.sidebarMenus = menuTree;
   // Ambil id_menu aktif

    next();
  } catch (error) {
    console.error('❌ Error loading sidebar:', error);
    next(error);
  }
};

module.exports = loadSidebar;
