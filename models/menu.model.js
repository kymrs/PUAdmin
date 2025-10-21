module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define("Menu", {
      id_menu: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nama_menu: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      urutan: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      }
    },
    {
      tableName: "tbl_menu", // 👈 Tambahkan ini agar Sequelize pakai nama tabel yang benar
      timestamps: false // Hapus jika pakai createdAt & updatedAt
    });

    Menu.associate = (models) => {
      Menu.hasMany(models.Aksesmenu, { foreignKey: 'id_menu' });
      Menu.hasMany(models.Submenu, { foreignKey: 'id_menu' });
    };
    
  
    return Menu;
  };
  