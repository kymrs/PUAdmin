const { ProductHotel,  ProductHotelFaciility} = require("../../models");

class ProductHotelRepository {
  async create(payload, transaction = null) {
    return await ProductHotel.bulkCreate(payload, { transaction });
  }
  async findByProduct(productId) {
    return await ProductHotel.findAll({
      // include: [
      //   {
      //     model: ProductHotelFaciility,
      //     through: {attributes: []}
      //   }
      // ],
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
