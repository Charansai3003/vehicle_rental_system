const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

const {
    getDashboardStats
} = require("../controllers/adminController");

router.get(
    "/dashboard",
    authenticateToken,
    authorizeAdmin,
    getDashboardStats
);

module.exports = router;