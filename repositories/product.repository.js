const { Model, Op } = require("sequelize");
const { Product } = requier("../models");

class ProductRepository {
    async getAllProduct() {
        return await Product.findAll();
    }
}

module.exports = new ProductRepository;