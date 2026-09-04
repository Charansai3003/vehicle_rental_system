const pool = require("../config/db");

const createReview = async (req, res) => {
    try {
        const { vehicle_id, rating, comment } = req.body;
        const userId = req.user.id;

        if (!vehicle_id || !rating) {
            return res.status(400).json({
                message: "Vehicle ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const vehicleResult = await pool.query(
            `SELECT id FROM vehicles WHERE id = $1`,
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        const bookingResult = await pool.query(
            `SELECT id
             FROM bookings
             WHERE user_id = $1
             AND vehicle_id = $2
             AND status = 'COMPLETED'
             LIMIT 1`,
            [userId, vehicle_id]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(403).json({
                message: "You can review this vehicle only after completing a booking"
            });
        }

        const existingReview = await pool.query(
            `SELECT id
             FROM reviews
             WHERE user_id = $1
             AND vehicle_id = $2`,
            [userId, vehicle_id]
        );

        if (existingReview.rows.length > 0) {
            return res.status(400).json({
                message: "You have already reviewed this vehicle"
            });
        }

        const result = await pool.query(
            `INSERT INTO reviews (
                user_id,
                vehicle_id,
                rating,
                comment
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                userId,
                vehicle_id,
                rating,
                comment || null
            ]
        );

        res.status(201).json({
            message: "Review added successfully",
            review: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getVehicleReviews = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const result = await pool.query(
            `SELECT
                reviews.id,
                reviews.rating,
                reviews.comment,
                reviews.created_at,
                users.name AS user_name
             FROM reviews
             JOIN users ON reviews.user_id = users.id
             WHERE reviews.vehicle_id = $1
             ORDER BY reviews.created_at DESC`,
            [vehicleId]
        );

        res.status(200).json({
            reviews: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createReview,
    getVehicleReviews
};