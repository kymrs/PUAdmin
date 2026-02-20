const {ProductFlight} = require("../../models")

class ProductFlightRepository {

    async create(payload, transaction){
         return await ProductFlight.bulkCreate(payload, {transaction});
    }
    async findByProduct(productId) {
        return await ProductFlight.findAll({
        where: { product_id: productId }
        });
    }

    async deleteByProduct(productId, transaction) {
        return await ProductFlight.destroy({
        where: { product_id: productId },
        transaction
         });
    }
    
}

module.exports = new ProductFlightRepository();