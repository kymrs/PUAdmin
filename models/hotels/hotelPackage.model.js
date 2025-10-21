module.exports = (sequelize, DataTypes) => {
  const HotelPackage = sequelize.define('HotelPackage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.ENUM('Mekkah', 'Madinah'),
      allowNull: false,
    },
    number_of_night: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'package_hotels',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  HotelPackage.associate = models => {
    HotelPackage.belongsTo(models.Hotel, { foreignKey: 'hotel_id' });
  };

  return HotelPackage;
};
