const { DataTypes } = require("sequelize");
const { sequelize } = require("..");
const { underscoredIf } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_produk: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        kouta: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thumbnail_url: {
            type: DataTypes.STRING(255)
        },
        departure_airlines: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        return_airlines: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('draft', 'submit'),
            allowNull: true
        }
    }, {
        tableName: 'tbl_product',
        timestamp: true,
        underscored: true
    })
    return Product;
}