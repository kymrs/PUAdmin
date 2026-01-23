'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    nama_produk: DataTypes.STRING,
    date: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    kouta: DataTypes.INTEGER,
    departure_airlines: DataTypes.STRING,
    return_airlines: DataTypes.STRING,
    description: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};