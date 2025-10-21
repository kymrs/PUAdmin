const responseHandler = require('../../../utils/response');
const hotelFacilityService = require('../../../services/hotels/hotelFacility.service');

class HotelFacilityController {
  async getAllHotelFacilities(req, res) {
    try {
      const facilities = await hotelFacilityService.getAllHotelFacilities();
      return responseHandler.success(res, 'All hotel facilities fetched', facilities);
    } catch (error) {
      return responseHandler.error(res, error.message);
    }
  }

  async getHotelFacilityById(req, res) {
    try {
      const facility = await hotelFacilityService.getHotelFacilityById(req.params.id);
      return responseHandler.success(res, 'Hotel facility fetched', facility);
    } catch (error) {
      return responseHandler.notFound(res, error.message);
    }
  }

  async createHotelFacility(req, res) {
    try {
      const facility = await hotelFacilityService.createHotelFacility(req.body);
      return responseHandler.success(res, 'Hotel facility created', facility);
    } catch (error) {
      return responseHandler.error(res, error.message);
    }
  }

  async updateHotelFacility(req, res) {
    try {
      const updatedFacility = await hotelFacilityService.updateHotelFacility(req.params.id, req.body);
      return responseHandler.success(res, 'Hotel facility updated', updatedFacility);
    } catch (error) {
      return responseHandler.error(res, error.message);
    }
  }

  async deleteHotelFacility(req, res) {
    try {
      await hotelFacilityService.deleteHotelFacility(req.params.id);
      return responseHandler.success(res, 'Hotel facility deleted');
    } catch (error) {
      return responseHandler.error(res, error.message);
    }
  }
}

module.exports = new HotelFacilityController();