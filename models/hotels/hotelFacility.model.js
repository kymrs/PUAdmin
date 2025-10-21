module.exports = (sequelize, DataTypes) => {
  const HotelFacility = sequelize.define('HotelFacility', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'hotel_facilities',
    timestamps: false
  });

  HotelFacility.associate = models => {
    HotelFacility.belongsTo(models.Hotel, { foreignKey: 'hotel_id' });
  };

  return HotelFacility;
};
