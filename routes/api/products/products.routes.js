const express = require("express");
const router = express.Router();
const { injectUser } = require ('../../../middleware/index.js');
const productController = require("../../../controllers/api/products/product.controller.js");
const multer = require('multer');
const path = require('path');

const FILE_TYPE = {
  "image/png": true,
  "image/jpeg": true,
  "image/jpg": true,
};

const diskStrorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE[file.mimetype];
    let uploadError = new Error('Invalid image type: JPG, JPEG, PNG only allowed');

    if(isValid){
        uploadError = null;
    }

    cb(uploadError, path.resolve("public/assets/img/products"));
  },
  filename: function(req, file, cb) {
    const safeName = Date.now() + "-" + file.originalname.replace(/[^\w.-]/g, "");
    cb(null, safeName);
  }
})

const upload = multer({storage: diskStrorage})

router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.post("/", injectUser,upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'hotel_image_mekkah', },
    { name: 'hotel_image_madinah', }
]), productController.createProduct);
router.put("/:id", injectUser, productController.updateProduct);
router.delete("/:id", injectUser, productController.deleteProduct);


module.exports = router;
