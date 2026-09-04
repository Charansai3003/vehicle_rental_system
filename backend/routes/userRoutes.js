const express = require("express");

const { 
    registerUser,
    loginUser,
    getUserProfile
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;