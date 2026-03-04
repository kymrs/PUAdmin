const express = require("express");
const router = express.Router();
const { injectUser } = require ('../../../middleware/index.js');
const productController = require("../../../controllers/api/products/product.controller.js");
const productFlightController = require("../../../controllers/api/products/productFlight.controller.js");
const productFacilityController = require("../../../controllers/api/products/productFacility.controller.js");
const productHotelController = require("../../../controllers/api/products/productHotel.controller.js");
const productItineraryController = require("../../../controllers/api/products/productItinerary.controller.js")
const productNoteController = require("../../../controllers/api/products/productNote.controller.js")
const productSnKController = require("../../../controllers/api/products/productSnK.controller.js");
const productPriceController = require("../../../controllers/api/products/productPrices.controller.js")
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
router.get("/:id/flights/", productFlightController.getFlightsByProduct);
router.get("/:id/facilities/", productFacilityController.getFaclitiesByProduct);
router.get("/:id/hotels/", productHotelController.getHotelByProduct);
router.get("/:id/itineraries/", productItineraryController.getItinerariesByProduct);
router.get("/:id/notes/", productNoteController.getNotesByProduct);
router.get("/:id/snk/", productSnKController.getSnkByProduct);
router.get("/:id/prices/", productPriceController.index);
router.post("/", injectUser,upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'hotel_image_mekkah', },
    { name: 'hotel_image_madinah', }
]), productController.createProduct);
router.put("/:id", injectUser, productController.updateProduct);
router.delete("/:id", injectUser, productController.deleteProduct);


module.exports = router;
