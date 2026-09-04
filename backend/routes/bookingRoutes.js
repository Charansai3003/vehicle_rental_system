const express = require("express");

const router = express.Router();

const authorizeAdmin = require("../middleware/adminMiddleware");

const authenticateToken = require("../middleware/authMiddleware");

const {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking
} = require("../controllers/bookingController");

router.post("/", authenticateToken, createBooking);

router.get("/", authenticateToken, authorizeAdmin, getAllBookings);

router.get("/my-bookings", authenticateToken, getMyBookings);

router.get("/:id", authenticateToken, getBookingById);

router.put(
    "/:id/status",
    authenticateToken,
    authorizeAdmin,
    updateBookingStatus
);

router.put("/:id/cancel", authenticateToken, cancelBooking);

module.exports = router;