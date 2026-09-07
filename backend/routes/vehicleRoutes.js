const express = require("express");

const {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeAdmin,
    addVehicle
);

router.get("/", getAllVehicles);

router.get("/:id", getVehicleById);

router.put(
    "/:id",
    authenticateToken,
    authorizeAdmin,
    updateVehicle
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeAdmin,
    deleteVehicle
);

module.exports = router;