const { ProductPrices } = require("../../models")

class ProductPricesRepository {
    async createMany(productId, prices){
        const payload = prices.map(p => ({
            product_id: productId,
            room_types: p.room_types,
            price: p.price
        }))
        return await ProductPrices.bulkCreate(payload, {transaction})
    }

    async findByProduct(productId){
        return await ProductPrices.findAll({
            where: { product_id: productId }
        })
    }

    async deleteByProduct(productId, transaction = null){
        return await ProductPrices.destroy({
            where: { product_id: productId },
            transaction
        })
    }
}

module.exports = new ProductPricesRepository();
;