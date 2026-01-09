module.exports = (sequelize, DataTypes) => {
  const ProductHotel = sequelize.define(
    "ProductHotel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hotel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "product_hotels",
      timestamps: false,
      underscored: true,
    }
  );

  return ProductHotel;
};
