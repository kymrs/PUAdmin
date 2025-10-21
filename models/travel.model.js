module.exports = (sequelize, DataTypes) => {
    const Travel = sequelize.define("Travel", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      logo_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contact_person: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
      }
    },
    {
      tableName: "travels", // 👈 Tambahkan ini agar Sequelize pakai nama tabel yang benar
      timestamps: true, // Hapus jika pakai createdAt & updatedAt
      createdAt: 'created_at',
      updatedAt: false,
    });

    Travel.associate = (models) => {
      Travel.hasMany(models.TravelReviews, { foreignKey: 'travel_id', as: 'travel' });
      Travel.hasMany(models.UmrahPackage, { foreignKey: 'travel_agency_id', as: 'packages' });
   };
  
    return Travel;
  };
  