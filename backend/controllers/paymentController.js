const pool = require("../config/db");

const createPayment = async (req, res) => {
    try {
        const {
            booking_id,
            payment_method
        } = req.body;

        const userId = req.user.id;

        // Check whether the booking exists
        const bookingResult = await pool.query(
            `SELECT *
             FROM bookings
             WHERE id = $1
             AND user_id = $2`,
            [booking_id, userId]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found or you are not authorized"
            });
        }

        const booking = bookingResult.rows[0];

        // Check whether payment already exists
        const existingPayment = await pool.query(
            `SELECT * FROM payments
             WHERE booking_id = $1`,
            [booking_id]
        );

        if (existingPayment.rows.length > 0) {
            return res.status(400).json({
                message: "Payment already exists for this booking"
            });
        }

        // Create a simple transaction ID
        const transactionId =
            "TXN_" + Date.now() + "_" + booking_id;

        const paymentResult = await pool.query(
            `INSERT INTO payments (
                booking_id,
                amount,
                payment_method,
                transaction_id,
                status,
                paid_at
            )
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            RETURNING *`,
            [
                booking_id,
                booking.total_amount,
                payment_method,
                transactionId,
                "SUCCESS"
            ]
        );

        // Confirm the booking after successful payment
        await pool.query(
            `UPDATE bookings
             SET status = 'CONFIRMED',
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [booking_id]
        );

        res.status(201).json({
            message: "Payment successful and booking confirmed",
            payment: paymentResult.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getMyPayments = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                payments.id,
                payments.booking_id,
                payments.amount,
                payments.payment_method,
                payments.transaction_id,
                payments.status,
                payments.paid_at,
                bookings.start_date,
                bookings.end_date,
                vehicles.brand,
                vehicles.model
            FROM payments
            JOIN bookings
                ON payments.booking_id = bookings.id
            JOIN vehicles
                ON bookings.vehicle_id = vehicles.id
            WHERE bookings.user_id = $1
            ORDER BY payments.id DESC`,
            [userId]
        );

        res.status(200).json({
            payments: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                payments.id,
                payments.booking_id,
                payments.amount,
                payments.payment_method,
                payments.transaction_id,
                payments.status,
                payments.paid_at,

                users.name AS user_name,
                users.email AS user_email,

                vehicles.brand,
                vehicles.model

            FROM payments

            JOIN bookings
                ON payments.booking_id = bookings.id

            JOIN users
                ON bookings.user_id = users.id

            JOIN vehicles
                ON bookings.vehicle_id = vehicles.id

            ORDER BY payments.id DESC`
        );

        res.status(200).json({
            payments: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        let query;
        let values;

        if (userRole === "ADMIN") {
            query = `
                SELECT
                    payments.id,
                    payments.booking_id,
                    payments.amount,
                    payments.payment_method,
                    payments.transaction_id,
                    payments.status,
                    payments.paid_at,
                    users.name AS user_name,
                    users.email AS user_email,
                    vehicles.brand,
                    vehicles.model
                FROM payments
                JOIN bookings ON payments.booking_id = bookings.id
                JOIN users ON bookings.user_id = users.id
                JOIN vehicles ON bookings.vehicle_id = vehicles.id
                WHERE payments.id = $1
            `;

            values = [id];
        } else {
            query = `
                SELECT
                    payments.id,
                    payments.booking_id,
                    payments.amount,
                    payments.payment_method,
                    payments.transaction_id,
                    payments.status,
                    payments.paid_at,
                    users.name AS user_name,
                    users.email AS user_email,
                    vehicles.brand,
                    vehicles.model
                FROM payments
                JOIN bookings ON payments.booking_id = bookings.id
                JOIN users ON bookings.user_id = users.id
                JOIN vehicles ON bookings.vehicle_id = vehicles.id
                WHERE payments.id = $1
                AND bookings.user_id = $2
            `;

            values = [id, userId];
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Payment not found or you are not authorized"
            });
        }

        res.status(200).json({
            payment: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createPayment,
    getMyPayments,
    getAllPayments,
    getPaymentById
};