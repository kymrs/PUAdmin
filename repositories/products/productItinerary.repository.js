const { ProductItinerary } = require("../../models");

class ProductItineraryRepository {
    async create(payload, transaction = null) {
        return await ProductItinerary.bulkCreate(payload, { transaction });
    }
    async findByProduct(productId) {
        return await ProductItinerary.findAll({
            where: { product_id: productId },
        });
    }
    async deleteByProductId(productId, transaction = null) {
        return await ProductItinerary.destroy({
            where: { product_id: productId },
            transaction,
        });
    }
}

module.exports = new ProductItineraryRepository();