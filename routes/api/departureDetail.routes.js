const express = require('express');
const departureDetailController = require('../../controllers/api/departureDetail.controller');
const { injectUser } = require('../../middleware');
const router = express.Router();

router.get("/", departureDetailController.getAllDepartureDetails);
router.get("/:id", departureDetailController.getDepartureDetailById);
router.post("/", injectUser, departureDetailController.createDepartureDetail);
router.put("/:id", injectUser, departureDetailController.updateDepartureDetail);
router.delete("/:id", injectUser, departureDetailController.deleteDepartureDetail);

module.exports = router;