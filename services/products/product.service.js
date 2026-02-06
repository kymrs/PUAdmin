const productRepository = require("../../repositories/products/product.repository");
const productPricesRepository = require("../../repositories/products/productPrices.repository");
const productFlightRepository = require("../../repositories/products/productFlight.repository");
const productNoteRepository = require("../../repositories/products/productNote.repository");
const productSnKRepository = require("../../repositories/products/productSnK.repository");



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

       async createProduct(productData) {
            const transaction = await db.sequelize.transaction();

            try {
            const { prices, flights, ...productFields } = productData;

            //  create product
            const newProduct = await productRepository.createProduct(
                productFields,
                transaction
            );

            //  create prices
            if (prices?.length) {
                const pricePayload = prices.map(p => ({
                product_id: newProduct.id,
                room_types: p.room_types,
                price: p.price
                }));

                await productPricesRepository.bulkCreate(
                pricePayload,
                transaction
                );
            }

            // create flights
            if (flights?.length) {
                const flightPayload = flights.map(f => ({
                product_id: newProduct.id,
                type: f.type, // DEPARTURE / RETURN
                maskapai: f.maskapai
                }));

                await productFlightRepository.bulkCreate(
                flightPayload,
                transaction
                );
            }

            // create notes
            if (notes?.length) {
                const notePayload = notes.map(n => ({
                product_id: newProduct.id,
                note: n.note
                }));

                await productNoteRepository.bulkCreate(
                notePayload,
                transaction
                );
            }

            // create SnK
            if(snks?.length) {
                const snkPayload = snks.map(s => ({
                product_id: newProduct.id,
                snk: s.snk
                }));

                await productSnKRepository.bulkCreate(
                snkPayload,
                transaction
                );
            }

            //creare Facility
            if(facilities?.length) {
                const facilityPayload = facilities.map(f => ({
                product_id: newProduct.id,
                facility: f.facility,
                type: f.type
                }));

                await productFacilityRepository.bulkCreate(
                facilityPayload,
                transaction
                );
            }

            // create Hotel
            if(hotel?.length) {
                const hotelPayload = hotel.map(h => ({
                   product_id: productId,
                    name: h.name,
                    city: h.city,
                    rating: h.rating,
                    jarak: h.jarak,
                    image: h.image,
                }));

                await productHotelRepository.bulkCreate(
                hotelPayload,
                transaction
                );
            }

            await transaction.commit();
            return newProduct;

            } catch (error) {
            await transaction.rollback();
            throw new Error(error.message);
            }
        }

       async updateProduct(id, productData) {
        try {
            const { prices, ...productFields } = productData;
            await productRepository.updateProduct(id, productFields);
            if (prices) {
                // Delete old prices and add new ones
                await productPricesRepository.deleteByProduct(id);
                await productPricesRepository.createMany(id, prices);
            }
            return await productRepository.getProductById(id);
        } catch (error) {
            throw new Error(error.message);
        }
       }
}

module.exports = new ProductService;