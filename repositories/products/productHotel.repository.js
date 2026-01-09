const { ProductHotel } = require("../models");

class ProductHotelRepository {
  async create(data, transaction = null) {
    return await ProductHotel.create(data, { transaction });
  }

  async deleteByProductId(productId, transaction = null) {
    return await ProductHotel.destroy({
      where: { product_id: productId },
      transaction,
    });
  }
}

module.exports = new ProductHotelRepository();
