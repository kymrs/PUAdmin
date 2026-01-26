const express = require('express');
const hotelController = require('../../../controllers/api/hotels/hotel.controller');
const { injectUser } = require('../../../middleware');
const router = express.Router();
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

    cb(uploadError, path.resolve("public/assets/img/uploads"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname + "-" + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({storage: diskStrorage});

router.get("/", hotelController.getAllHotels);
router.get("/datatables", injectUser, hotelController.getAllHotelDatatables);
router.get("/:id", hotelController.getHotelById);
router.post("/", upload.single('image'), hotelController.createHotel);
router.put("/:id", upload.single('image'), hotelController.updateHotel);
router.delete("/:id", hotelController.deleteHotel);

module.exports = router;