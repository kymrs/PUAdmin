const { sequelize } = require("../../../models");
const ProductService = require("../../../services/products/productService.service");
const productFlightRepository = require("../../../repositories/products/productFlight.repository");

class ProductFlightController {
    async createFlights(req, res) {
        const t = sequelize.transaction();

        try {
            const {flights, ...productPayload} = req.body;
            const product = await ProductService.createProduct(productPayload, t);

            await productFlightRepository.createFlights(flights, product.id, t);

            await t.commit();

            res.status(201).json({ success: true, data: product });
        } catch(err) {
            await t.rollback();
            console.error(err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}

module.exports = new ProductFlightController();