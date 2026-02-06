const ProductItineraryRepository = require("../../repositories/products/productItinerary.repository");

class ProductItineraryService {
    async createItinerary(itineraries, productId, transaction) {
        if(!itineraries || itineraries.length === 0) return [];

        const itineraryPayload = itineraries.map(i => ({
            product_id: productId, 
            day: i.day, 
            activity: i.activity,
            description: i.description
        }))
        return await ProductItineraryRepository.create(itineraryPayload, transaction);
    }
    async replaceItinerary(productId, itineraries, transaction = null) {
        if (!itineraries || itineraries.length === 0) return [];

        await ProductItineraryRepository.deleteByProductId(productId, transaction);

        const itineraryPayload = itineraries.map(i => ({
            product_id: productId, 
            day: i.day, 
            activity: i.activity,
            description: i.description
        }));

        return await ProductItineraryRepository.create(itineraryPayload, transaction);
    }
}

module.exports = new ProductItineraryService();