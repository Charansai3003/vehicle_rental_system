const express = require("express");

const router = express.Router();

const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking
} = require("../controllers/bookingController");

router.post("/", createBooking);

router.get("/", getAllBookings);

router.get("/:id", getBookingById);

router.put("/:id/status", updateBookingStatus);

router.put("/:id/cancel", cancelBooking);

module.exports = router;