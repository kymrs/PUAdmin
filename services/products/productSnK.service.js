const ProductSnKRepository = require("../../repositories/products/productSnK.repository");

class ProductSnKService {
    async createSnK(snks, prodcutId) {
        if (!snks || snks.length === 0) return [];

        const snkPayload = snks.map(s => ({
            product_id: prodcutId,
            snk: s.snk
        }));

        return await ProductSnKRepository.create(snkPayload);
    }
    async replaceSnK(productId, snks, transaction = null) {
        if (!snks || snks.length === 0) return [];

        await ProductSnKRepository.deleteByProduct(productId, transaction);

        const snkPayload = snks.map(s => ({
            product_id: productId,
            snk: s.snk
        }));

        return await ProductSnKRepository.create(snkPayload, transaction);
    }
}

module.exports = new ProductSnKService();