const express = require("express");
const router = express.Router();
const { injectUser } = require ('../../middleware');
const productController = require("../../controllers/api/products/product.controller.js");

router.get("/", productController.getAllProduct);

module.exports = router;
