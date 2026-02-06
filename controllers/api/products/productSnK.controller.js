const ProductService = require("../../../services/products/productService.service");
const productFacilityRepository = require("../../../repositories/products/productFacility.repository");

class ProductFacilityController {
    async createFacilities(req, res) {
        const t = sequelize.transaction();

        try {
            const {facilities, ...productPayload} = req.body;
            const product = await ProductService.createProduct(productPayload, t);

            await productFacilityRepository.createFacility(facilities, product.id, t);

            await t.commit();

            res.status(201).json({ success: true, data: product });
        } catch(err) {
            await t.rollback();
            console.error(err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}                   
module.exports = new ProductFacilityController();