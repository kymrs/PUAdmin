const { ProductHotelFacility } = require("../../models");

class ProductHotelFacilityRepository {
  async create(payload, transaction = null) {
    return ProductHotelFacility.create(payload, { transaction });
  }

  async bulkCreate(payloads, transaction = null) {
    return ProductHotelFacility.bulkCreate(payloads, { transaction });
  }

  async deleteByHotel(productHotelId, transaction = null) {
    return ProductHotelFacility.destroy({
      where: { product_hotel_id: productHotelId },
      transaction
    });
  }
}

module.exports = new ProductHotelFacilityRepository();
