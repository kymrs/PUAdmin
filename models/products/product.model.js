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
        category_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nama_produk: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        tgl_keberangkatan: {
            type: DataTypes.DATE,
            allowNull: false
        },
        tmp_keberangkatan: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        qouta: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thumbnail_url: {
            type: DataTypes.STRING(255)
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
        tableName: 'product',
        timestamp: true,
        underscored: true
    })

    Product.associate = (models) => {
        Product.hasMany(models.ProductPrices, {
            foreignKey: 'product_id',
            as: 'prices',
            onDelete: 'CASCADE'
       });
        Product.hasMany(models.ProductFlight, {
            foreignKey: 'product_id',
            as: 'flights',
            onDelete: 'CASCADE'
       });
        Product.hasMany(models.ProductSnK, {
            foreignKey: 'product_id',
            as: 'snk',
            onDelete: 'CASCADE'
       });
        Product.hasMany(models.ProductFacility, {
            foreignKey: 'product_id',
            as: 'facility',
            onDelete: 'CASCADE'
       });
        Product.hasMany(models.ProductNote, {
            foreignKey: 'product_id',
            as: 'notes',
            onDelete: 'CASCADE'
       });
        Product.hasMany(models.ProductHotel, {
            foreignKey: 'product_id',
            as: 'hotels',
            onDelete: 'CASCADE'
       });
    }


    return Product;
}