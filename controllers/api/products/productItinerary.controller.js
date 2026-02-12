const ProductService = require("../../../services/products/productService.service");
const productItineraryRepository = require("../../../repositories/products/productItinerary.repository");

class ProductItineraryController {
    async createItineraries(req, res) {
        const t = sequelize.transaction();

        try {
            const {Itineraries, ...productPayload} = req.body;
            const product = await ProductService.createProduct(productPayload, t);

            await productItineraryRepository.createItinerary(Itineraries, product.id, t);

            await t.commit();

            res.status(201).json({ success: true, data: product });
        } catch(err) {
            await t.rollback();
            console.error(err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}

module.exports = new ProductItineraryController();