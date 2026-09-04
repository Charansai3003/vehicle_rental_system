const pool = require("../config/db");

const createBooking = async (req, res) => {
    try {
        const {
            user_id,
            vehicle_id,
            start_date,
            end_date,
            total_amount
        } = req.body;

        const vehicleResult = await pool.query(
            `SELECT * FROM vehicles WHERE id = $1`,
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        if (vehicleResult.rows[0].status !== "AVAILABLE") {
            return res.status(400).json({
                message: "Vehicle is not available"
            });
        }

        const overlapResult = await pool.query(
            `SELECT * FROM bookings
             WHERE vehicle_id = $1
                AND status IN ('PENDING', 'CONFIRMED')
                AND start_date <= $3
                AND end_date >= $2`,
            [vehicle_id, start_date, end_date]
        );

        if (overlapResult.rows.length > 0) {
            return res.status(400).json({
                message: "Vehicle is already booked for the selected dates"
            });
        }

        const bookingResult = await pool.query(
            `INSERT INTO bookings (
                user_id,
                vehicle_id,
                start_date,
                end_date,
                total_amount,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                user_id,
                vehicle_id,
                start_date,
                end_date,
                total_amount,
                "PENDING"
            ]
        );

        res.status(201).json({
            message: "Booking created successfully",
            booking: bookingResult.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                bookings.id,
                users.name AS user_name,
                users.email AS user_email,
                vehicles.brand,
                vehicles.model,
                vehicle_categories.name AS category,
                bookings.start_date,
                bookings.end_date,
                bookings.total_amount,
                bookings.status,
                bookings.created_at
            FROM bookings
            JOIN users ON bookings.user_id = users.id
            JOIN vehicles ON bookings.vehicle_id = vehicles.id
            JOIN vehicle_categories 
                ON vehicles.category_id = vehicle_categories.id
            ORDER BY bookings.id;
        `);

        res.status(200).json({
            bookings: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                bookings.id,
                users.name AS user_name,
                users.email AS user_email,
                vehicles.brand,
                vehicles.model,
                vehicle_categories.name AS category,
                bookings.start_date,
                bookings.end_date,
                bookings.total_amount,
                bookings.status,
                bookings.created_at,
                bookings.updated_at
            FROM bookings
            JOIN users ON bookings.user_id = users.id
            JOIN vehicles ON bookings.vehicle_id = vehicles.id
            JOIN vehicle_categories 
                ON vehicles.category_id = vehicle_categories.id
            WHERE bookings.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            booking: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = [
            "PENDING",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid booking status"
             });
        }

        const result = await pool.query(
            `UPDATE bookings
             SET status = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking status updated successfully",
            booking: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE bookings
             SET status = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            ["CANCELLED", id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking
};