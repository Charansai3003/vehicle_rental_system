const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    createReview,
    getVehicleReviews
} = require("../controllers/reviewController");

router.post("/", authenticateToken, createReview);

router.get("/vehicle/:vehicleId", getVehicleReviews);

module.exports = router;