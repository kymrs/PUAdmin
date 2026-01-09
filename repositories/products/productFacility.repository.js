const { ProductFacility } = require("../models");

class ProductFacilityRepository {
  async create(data, transaction = null) {
    return await ProductFacility.create(data, { transaction });
  }

  async deleteByProductId(productId, transaction = null) {
    return await ProductFacility.destroy({
      where: { product_id: productId },
      transaction,
    });
  }
}

module.exports = new ProductFacilityRepository();
