const ProductService = require("../../../services/products/productService.service");
const productHotelRepository = require("../../../repositories/products/productHotel.repository");

class ProductHotelController {
    async createHotels(req, res) {
        const t = sequelize.transaction();

        try {
            const {hotels, ...productPayload} = req.body;
            const product = await ProductService.createProduct(productPayload, t);

            await productHotelRepository.createHotels(hotels, product.id, t);

            await t.commit();

            res.status(201).json({ success: true, data: product });
        } catch(err) {
            await t.rollback();
            console.error(err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}

module.exports = new ProductHotelController();