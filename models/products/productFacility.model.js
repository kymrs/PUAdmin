module.exports = (sequelize, DataTypes) => {
  const ProductFacility = sequelize.define(
    "ProductFacility",
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
      facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("INCLUDE", "EXCLUDE"),
        allowNull: false,
      },
    },
    {
      tableName: "product_facilities",
      timestamps: false,
      underscored: true,
    }
  );

  return ProductFacility;
};
