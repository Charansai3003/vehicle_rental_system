const express = require("express");

const { 
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
 } = require("../controllers/vehicleController");

const router = express.Router();

router.post("/", addVehicle);
router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;