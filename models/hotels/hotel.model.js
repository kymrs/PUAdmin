module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER, // rating 1-5
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'hotels',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Hotel.associate = models => {
    Hotel.hasMany(models.HotelFacility, { foreignKey: 'hotel_id' });
    Hotel.hasMany(models.HotelPackage, { foreignKey: 'hotel_id' });
  };

  return Hotel;
};
