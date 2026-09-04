const pool = require("../config/db");

const createBooking = async (req, res) => {
    try {
        const {
            vehicle_id,
            start_date,
            end_date
        } = req.body;

        const user_id = req.user.id;

        if (!vehicle_id || !start_date || !end_date) {
            return res.status(400).json({
                message: "Vehicle ID, start date and end date are required"
            });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (
            isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        if (startDate < today || endDate < today) {
            return res.status(400).json({
                message: "Booking dates cannot be in the past"
            });
        }

        if (endDate <= startDate) {
            return res.status(400).json({
                message: "End date must be after start date"
            });
        }

        const vehicleResult = await pool.query(
            `SELECT * FROM vehicles WHERE id = $1`,
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        const vehicle = vehicleResult.rows[0];

        if (vehicle.status !== "AVAILABLE") {
            return res.status(400).json({
                message: "Vehicle is not available"
            });
        }

        const overlapResult = await pool.query(
            `SELECT * FROM bookings
             WHERE vehicle_id = $1
                AND status IN ('PENDING', 'CONFIRMED')
                AND start_date < $3
                AND end_date > $2`,
            [vehicle_id, start_date, end_date]
        );

        if (overlapResult.rows.length > 0) {
            return res.status(400).json({
                message: "Vehicle is already booked for the selected dates"
            });
        }

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const rentalDays = Math.ceil(
            (endDate - startDate) / millisecondsPerDay
        );

        const total_amount =
            rentalDays * Number(vehicle.price_per_day);

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
            rental_days: rentalDays,
            total_amount,
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
        const userId = req.user.id;
        const userRole = req.user.role;

        let query;
        let values;

        if (userRole === "ADMIN") {
            query = `
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
                    bookings.created_at,
                    bookings.updated_at
                FROM bookings
                JOIN users ON bookings.user_id = users.id
                JOIN vehicles ON bookings.vehicle_id = vehicles.id
                JOIN vehicle_categories
                    ON vehicles.category_id = vehicle_categories.id
                WHERE bookings.id = $1
            `;

            values = [id];

        } else {
            query = `
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
                    bookings.created_at,
                    bookings.updated_at
                FROM bookings
                JOIN users ON bookings.user_id = users.id
                JOIN vehicles ON bookings.vehicle_id = vehicles.id
                JOIN vehicle_categories
                    ON vehicles.category_id = vehicle_categories.id
                WHERE bookings.id = $1
                AND bookings.user_id = $2
            `;

            values = [id, userId];
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found or you are not authorized"
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

        if (status !== "COMPLETED") {
            return res.status(400).json({
                message: "Only COMPLETED status can be set manually"
            });
        }

        const bookingResult = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [id]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookingResult.rows[0];

        if (booking.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Only confirmed bookings can be marked as completed"
            });
        }

        const endDate = new Date(booking.end_date);
        const now = new Date();

        if (now < endDate) {
            return res.status(400).json({
                message: "Booking cannot be completed before the rental end date"
            });
        }

        const result = await pool.query(
            `UPDATE bookings
             SET status = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            ["COMPLETED", id]
        );

        res.status(200).json({
            message: "Booking marked as completed successfully",
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
        const userId = req.user.id;

        const bookingResult = await pool.query(
            `SELECT *
             FROM bookings
             WHERE id = $1
             AND user_id = $2`,
            [id, userId]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found or you are not authorized"
            });
        }

        const booking = bookingResult.rows[0];

        if (
            booking.status !== "PENDING" &&
            booking.status !== "CONFIRMED"
        ) {
            return res.status(400).json({
                message: "This booking cannot be cancelled"
            });
        }

        const startDate = new Date(booking.start_date);
        const now = new Date();

        if (startDate <= now) {
            return res.status(400).json({
                message: "Booking cannot be cancelled after the rental period has started"
            });
        }

        const result = await pool.query(
            `UPDATE bookings
             SET status = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            ["CANCELLED", id]
        );

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

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                bookings.id,
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
            JOIN vehicles ON bookings.vehicle_id = vehicles.id
            JOIN vehicle_categories
                ON vehicles.category_id = vehicle_categories.id
            WHERE bookings.user_id = $1
            ORDER BY bookings.id DESC`,
            [userId]
        );

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

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getMyBookings
};