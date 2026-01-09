module.exports = (sequelize, DataTypes) => {
  const ProductFlight = sequelize.define(
    "ProductFlight",
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
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "product_flight",
      timestamps: false,
      underscored: true,
    }
  );

  return ProductFlight;
};
