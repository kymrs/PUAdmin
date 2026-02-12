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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      city: {
        type: DataTypes.ENUM("Mekkah", "Madinah"),
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jarak:{
        type:DataTypes.STRING(100),
        allowNull: false
      },
      image:{
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: "product_hotels",
     timestamps: true,
    underscored: true
    }
  );
  ProductHotel.associate = (models)=> {
    ProductHotel.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    ProductHotel.hasMany(models.ProductHotelFaciility, {
      foreignKey: 'product_hotel_id',
      as: 'facilities',
      onDelete: 'CASCADE'
    });
  }

  return ProductHotel;
};
