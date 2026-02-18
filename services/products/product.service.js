const { sequelize } = require("../../models");
const productRepository = require("../../repositories/products/product.repository");
const productPricesRepository = require("../../repositories/products/productPrices.repository");
const productFlightRepository = require("../../repositories/products/productFlight.repository");
const productNoteRepository = require("../../repositories/products/productNote.repository");
const productSnKRepository = require("../../repositories/products/productSnK.repository");
const productHotelRepository = require("../../repositories/products/productHotel.repository")
const productFacilityRepository = require("../../repositories/products/productFacility.repository");
const productItineraryRepository = require("../../repositories/products/productItinerary.repository");




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
            const transaction = await sequelize.transaction();

            try {
            let { prices, flights, notes, snks, facilities,hotels, itineraries,...productFields } = productData;
            
           // 2. Fungsi Helper untuk mastiin data itu Array
            const ensureArray = (data) => {
                if (!data) return []; // Kalau null/undefined, balikin array kosong
                if (Array.isArray(data)) return data; // Kalau udah array, balikin langsung
                if (typeof data === 'string') {
                    try {
                        return JSON.parse(data);
                    } catch (e) {
                        return [];
                    }
                }
                return [data]; // Kalau cuma 1 objek, bungkus jadi array
            };

            const validatePrices = ensureArray(prices);
            const validateFlights = ensureArray(flights);
            const validateNotes = ensureArray(notes);
            const validateSnks = ensureArray(snks);
            const validateFacilities = ensureArray(facilities);
            const validateHotels = ensureArray(hotels);
            const validateItineraries = ensureArray(itineraries);
            


            // if (typeof prices === "string") prices = JSON.parse(prices);
            // if (typeof flights === "string") flights = JSON.parse(flights);
            // if (typeof notes === "string") notes = JSON.parse(notes);
            // if (typeof snks === "string") snks = JSON.parse(snks);
            // if (typeof facilities === "string") facilities = JSON.parse(facilities);
            // if (typeof hotels === "string") hotels = JSON.parse(hotels);
            // if (typeof itineraries === "string") itineraries = JSON.parse(itineraries);


            //  create product
            const newProduct = await productRepository.createProduct(
                productFields,
                transaction
            );

            console.log("Cek Tipe Data Prices:", typeof validatePrices);
            console.log("Is Array?:", Array.isArray(validatePrices));
            console.log("Isi Data:", validatePrices);
            //  create prices
            if (validatePrices?.length) {
                const pricePayload = validatePrices.map(p => ({
                product_id: newProduct.id,
                room_types: p.type,
                price: p.price
                }));

                await productPricesRepository.createMany(  pricePayload,
                transaction);   
                console.log("price payload:", pricePayload)
            }

            // create flights
            if (validateFlights?.length) {
                const flightPayload = validateFlights.map(f => ({
                product_id: newProduct.id,
                airline_name: f.airline_name,
                type: f.type // DEPARTURE / RETURN
               
                }));

                await productFlightRepository.create(
                flightPayload,
                transaction
                );
                console.log("flight payload:", flightPayload)
            }

            // create notes
            if (validateNotes?.length) {
                const notePayload = validateNotes.map(n => ({
                product_id: newProduct.id,
                note: n.note
                }));

                await productNoteRepository.createNotes(
                notePayload,
                transaction
                );
                console.log("note payload:", notePayload)
            }

            // create SnK
            if(validateSnks?.length) {
                const snkPayload = validateSnks.map(s => ({
                product_id: newProduct.id,
                name: s.snk
                }));

                await productSnKRepository.create(
                snkPayload,
                transaction
                );
                console.log("snk payload:", snkPayload)
            }

            //creare Facility
            if(validateFacilities?.length) {
                const facilityPayload = validateFacilities.map(f => ({
                product_id: newProduct.id,
                facility: f.facility,
                type: f.type
                }));

                await productFacilityRepository.create(
                facilityPayload,
                transaction
                );
                console.log("facility payload:", facilityPayload)
            }

            // create Hotel
            if(validateHotels?.length) {
                const hotelPayload = validateHotels.map(h => ({
                   product_id: newProduct.id,
                    name: h.name,
                    city: h.city,
                    rating: h.rating,
                    jarak: h.jarak,
                    image: h.image,
                }));

                await productHotelRepository.create(
                hotelPayload,
                transaction
                );
                console.log("hotel payload:", hotelPayload)
            }
            // 
            if(validateItineraries?.length){
                const itineraryPayload = validateItineraries.map(i => ({
                    product_id: newProduct.id,
                    day_order: i.day_order,
                    title: i.title,
                    description: i.description
                }));

                await productItineraryRepository.create(
                    itineraryPayload,
                    transaction
                );
                console.log("itinerary payload:", itineraryPayload)
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
            let { prices, flights, notes, snks, facilities,hotels, itineraries,...productFields } = productData;
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