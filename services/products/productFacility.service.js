const ProductFacilityRepository = require("../../repositories/products/productFacility.repository");

class ProductFacilityService {
    async createFacility(facilities, productId, transaction) {
        if(!facilities || facilities.length === 0) return [];

        const facilityPayload = facilities.map(f => ({
            product_id: productId, 
            facility: f.facility, 
            type: f.type
        }))
        return await ProductFacilityRepository.create(facilityPayload, transaction);
    }
    async replaceFacility(productId, facilities, transaction = null) {
        if (!facilities || facilities.length === 0) return [];

        await ProductFacilityRepository.deleteByProductId(productId, transaction);

        const facilityPayload = facilities.map(f => ({
            product_id: productId, 
            facility: f.facility, 
            type: f.type
        }));

        return await ProductFacilityRepository.create(facilityPayload, transaction);
    }
}

module.exports = new ProductFacilityService();