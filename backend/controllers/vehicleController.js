const pool = require("../config/db");

const addVehicle = async (req, res) => {
    try {
        const {
            category_id,
            brand,
            model,
            registration_number,
            year,
            fuel_type,
            transmission,
            seats,
            price_per_day,
            status,
            image_url
        } = req.body;

        const newVehicle = await pool.query(
            `INSERT INTO vehicles
            (
                category_id,
                brand,
                model,
                registration_number,
                year,
                fuel_type,
                transmission,
                seats,
                price_per_day,
                status,
                image_url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [
                category_id,
                brand,
                model,
                registration_number,
                year,
                fuel_type,
                transmission,
                seats,
                price_per_day,
                status,
                image_url
            ]
        );

        res.status(201).json({
            message: "Vehicle added successfully",
            vehicle: newVehicle.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await pool.query(
         `SELECT 
            vehicles.*,
            vehicle_categories.name AS category_name
        FROM vehicles
        JOIN vehicle_categories
            ON vehicles.category_id = vehicle_categories.id
        ORDER BY vehicles.id ASC`
        );

        res.status(200).json({
            vehicles: vehicles.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await pool.query(
            `SELECT 
                vehicles.*,
                vehicle_categories.name AS category_name
             FROM vehicles
             JOIN vehicle_categories
                ON vehicles.category_id = vehicle_categories.id
             WHERE vehicles.id = $1`,
            [id]
        );

        if (vehicle.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            vehicle: vehicle.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category_id,
            brand,
            model,
            registration_number,
            year,
            fuel_type,
            transmission,
            seats,
            price_per_day,
            status,
            image_url
        } = req.body;

        const updatedVehicle = await pool.query(
            `UPDATE vehicles
             SET
                category_id = $1,
                brand = $2,
                model = $3,
                registration_number = $4,
                year = $5,
                fuel_type = $6,
                transmission = $7,
                seats = $8,
                price_per_day = $9,
                status = $10,
                image_url = $11,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $12
             RETURNING *`,
            [
                category_id,
                brand,
                model,
                registration_number,
                year,
                fuel_type,
                transmission,
                seats,
                price_per_day,
                status,
                image_url,
                id
            ]
        );

        if (updatedVehicle.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedVehicle = await pool.query(
            `DELETE FROM vehicles
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (deletedVehicle.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle deleted successfully",
            vehicle: deletedVehicle.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};