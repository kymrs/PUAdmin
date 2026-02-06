const { ProductHotel } = require("../models");

class ProductHotelRepository {
  async create(data, transaction = null) {
    return await ProductHotel.bulkCreate(data, { transaction });
  }
  async findByProduct(productId) {
    return await ProductHotel.findAll({
      where: { product_id: productId },
    });
  }
  async deleteByProductId(productId, transaction = null) {
    return await ProductHotel.destroy({
      where: { product_id: productId },
      transaction,
    });
  }
}

module.exports = new ProductHotelRepository();
