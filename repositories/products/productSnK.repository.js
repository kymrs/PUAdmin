const { ProductSnK } = require("../../models")

class ProductSnKRepository {
    async create(snks, transaction = null){
        return await ProductSnK.bulkCreate(snks, {transaction});
    }
    async findByProduct(productId){
        return await ProductSnK.findAll({
            where: { product_id: productId }
        });
    }
    async deleteByProduct(productId, transaction = null){
        return await ProductSnK.destroy({
            where: { product_id: productId },
            transaction
        })
    }
}

module.exports = new ProductSnKRepository