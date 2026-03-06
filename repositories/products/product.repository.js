const { Model, Op, where } = require("sequelize");
const { Product, ProductPrices, ProductFlight, ProductHotel, ProductFacility, ProductItinerary, ProductSnK, ProductNote, Akses } = require("../../models");

class ProductRepository {
    async getAllProduct() {
        return await Product.findAll({
            include: [
                {
                    model: ProductPrices,
                    as: "prices",
                    attributes: ["room_types", "price"]
                },
                {
                    model: ProductFlight,
                    as: "flights",
                    attributes: ["airline_name", "type"]
                },
                {
                    model: ProductHotel,
                    as: "hotels",
                    attributes: ["name", "city", "rating", "jarak", "image", "facilities"]
                },
                {
                    model: ProductFacility,
                    as: "facility",
                    attributes: ["facility", "type"]
                },
                {
                    model: ProductItinerary,
                    as: "itinerary",
                    attributes: ["day_order", "title", "description"]
                },
                {
                    model: ProductSnK,
                    as: "snk",
                    attributes: ["name"]
                },
                {
                    model: ProductNote,
                    as: "notes",
                    attributes: ["note"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });
    }

    async getPaginatedProduct({ start, length, search, order, columns }) {
        const where = {
            ...(search && {
                [Op.or]: [
                   { name: {[Op.like]: `%${search}`}},
                   { harga: {[Op.like]: `%${search}`}},
                ]
            })
        };

        const sort = order && order.length > 0 
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

        const offset = start || 0;
        const limit = length || 0;

        const result = await Product.findAndCountAll({
            where,
            order: sort,
            offset,
            limit
        })

        return result;
    }

    async getProductById(id) {
        return await Product.findByPk(id,{
            include: [
                {
                    model: ProductPrices,
                    as: "prices",
                    attributes: ["room_types", "price"]
                },
                {
                    model: ProductFlight,
                    as: "flights",
                    attributes: ["airline_name", "type"]
                },
                {
                    model: ProductHotel,
                    as: "hotels",
                    attributes: ["name", "city", "rating", "jarak", "image", "facilities"]
                },
                {
                    model: ProductFacility,
                    as: "facility",
                    attributes: ["facility", "type"]
                },
                {
                    model: ProductItinerary,
                    as: "itinerary",
                    attributes: ["day_order", "title", "description"]
                },
                {
                    model: ProductSnK,
                    as: "snk",
                    attributes: ["name"]
                },
                {
                    model: ProductNote,
                    as: "notes",
                    attributes: ["note"]
                }
            ],
        });
    }

    async createProduct(productData) {
        return await Product.create(productData);
    }
    async deleteProduct(id) {
        return await Product.destroy({ where: {id}});
    }
    async updateProduct(id, productData) {
        return await Product.update(productData, {
            where: {id}
        });
    }

    async deleteUpdate(id) {
        return await Product.destroy({ where: {id}});
    }
}

module.exports = new ProductRepository;