const { ProductFacility } = require("../../models");

class ProductFacilityRepository {
  async create(payload, transaction) {
    return await ProductFacility.bulkCreate(payload, { transaction });
  }
  async findByProduct(productId) {
    return await ProductFacility.findAll({
      where: { product_id: productId },
    });
  }
  async deleteByProductId(productId, transaction = null) {
    return await ProductFacility.destroy({
      where: { product_id: productId },
      transaction,
    });
  }
}

module.exports = new ProductFacilityRepository();
