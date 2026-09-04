const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

const {
    createPayment,
    getMyPayments,
    getAllPayments,
    getPaymentById
} = require("../controllers/paymentController");

router.post("/", authenticateToken, createPayment);

router.get("/my-payments", authenticateToken, getMyPayments);

router.get(
    "/",
    authenticateToken,
    authorizeAdmin,
    getAllPayments
);

router.get("/:id", authenticateToken, getPaymentById);

module.exports = router;