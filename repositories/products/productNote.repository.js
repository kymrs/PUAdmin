const { ProductNote } = require('../../models');

class ProductNoteRepository {

    async createNotes(payload, transaction=null) {
        return await ProductNote.bulkCreate(payload, {transaction});
    }

    async findByProduct(productId) {
        return await ProductNote.findAll({
            where: { product_id: productId }
        });
    }

    async deleteByProduct(productId, transaction) {
        return await ProductNote.destroy({
            where: { product_id: productId },
            transaction
        });
    }
    
}

module.exports = new ProductNoteRepository();