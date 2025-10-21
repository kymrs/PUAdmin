module.exports = (sequelize, DataTypes) => {
    const Submenu = sequelize.define("Submenu", {
      id_submenu: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_menu: {
        type: DataTypes.INTEGER,
      },
      nama_submenu: {
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
      tableName: "tbl_submenu", // 👈 Tambahkan ini agar Sequelize pakai nama tabel yang benar
      timestamps: false // Hapus jika pakai createdAt & updatedAt
    });

    Submenu.associate = (models) => {
      Submenu.belongsTo(models.Menu, { foreignKey: 'id_menu' });
      Submenu.hasMany(models.Aksessubmenu, { foreignKey: 'id_submenu' });
    };
    
  
    return Submenu;
  };
  