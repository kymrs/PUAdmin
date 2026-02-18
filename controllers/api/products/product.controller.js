const productService = require("../../../services/products/product.service");

class ProductController {
  // List all products
  async getAllProduct(req, res) {
    try {
      const products = await productService.getAllProduct();
      res.json({ success: true, data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // Create new product
  async createProduct(req, res) {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const productData = {
      ...req.body,
      prices: JSON.parse(req.body.prices || "[]"),
      flights: JSON.parse(req.body.flights || "[]"),
      hotels: JSON.parse(req.body.hotels || "[]"),
      itineraries: JSON.parse(req.body.itineraries || "[]"),
      snks: JSON.parse(req.body.snks || "[]"),
      notes: JSON.parse(req.body.notes || "[]"),
    };

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}


  // Update product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      const updated = await productService.updateProduct(id, productData);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json({ success: true, message: "Product updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json({ success: true, message: "Product deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // Datatables endpoint
  async getAllProductsDatatables(req, res) {
    try {
      const result = await productService.getAllProductsDatatables(req.query);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}

module.exports = new ProductController();
