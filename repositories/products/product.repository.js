const { Model, Op, where } = require("sequelize");
const { Product } = require("../../models");

class ProductRepository {
    async getAllProduct() {
        return await Product.findAll();
    }

    async getPaginatedProduct({ start, length, search, order, columns }) {
        const where = {
            ...(search && {
                [Op.or]: [
                   { name: {[Op.like]: `%${search}`}},
                   { harga: {[Op.like]: `%${search}`}},
                ]
            })
        };

        const sort = order && order.length > 0 
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

        const offset = start || 0;
        const limit = length || 0;

        const result = await Product.findAndCountAll({
            where,
            order: sort,
            offset,
            limit
        })

        return result;
    }

    async getProductById(id) {
        return await Product.findByPk(id);
    }

    async createProduct(productData) {
        return await Product.create(productData);
    }

    async updateProduct(id, productData) {
        return await Product.update(productData, {
            where: {id}
        });
    }

    async deleteUpdate(id) {
        return await Product.destroy({ where: {id}});
    }
}

module.exports = new ProductRepository;