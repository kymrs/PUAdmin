module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    jarak: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fasilitas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
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

    Hotel.hasMany(models.HotelPackage, { foreignKey: 'hotel_id' });
    // Hotel.belongsTo(
    //   models.Product, 
    //   through: productHotel,
    //   { foreignKey: 'product_id' }
    // );
  };

  return Hotel;
};
