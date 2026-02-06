const {ProductFlight} = require("../../models")

class ProductFlightRepository {

    async create(flights, transaction = null){
         return await ProductFlight.bulkCreate(flights, {transaction});
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