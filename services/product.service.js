const productRepository = require("../repositories/products/product.repository");
const hotelRepository = require("../repositories/hotels/hotel.repository");
const facilitiesRepository = require('../repositories/facilities/facility.repository')
const itineraryRepository = require("../repositories/itinerary.repository")


class ProductService {
   async getAllProduct() {
        const product = await productRepository.getAllProduct();
        return product || [] ;
   }

   async getProductById(id) {
        try{
            const product = await productRepository.getProductById(id);
            return product || null;
        } catch (error) {
            throw new Error(error.message);
        }
   }

     async getAllProductsDatatables({ draw, start, length, search, order, columns}) {
           const searchValue = search?.value || "";
   
           const { count, rows } = await productRepository.getPaginatedProduct({
               start: parseInt(start, 10) || 0,
               length: parseInt(length, 10) || 10,
               search: searchValue,
               order,
               columns
           });
   
           return {
               draw: parseInt(draw, 10),
               recordsTotal: count,
               recordsFiltered: count,
               data: rows
           }
       }
}

module.exports = new ProductService;