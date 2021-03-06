// import dependencies and initialize the express router
const express = require("express");
const ParkingController = require("../controllers/parking-controller");

const router = express.Router();


// define routes
router.get("", ParkingController.getParkingSlots);
router.post("", ParkingController.bookParking);
module.exports = router;
