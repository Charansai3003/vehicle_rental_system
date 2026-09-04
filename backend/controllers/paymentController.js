const pool = require("../config/db");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createPaymentOrder = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const userId = req.user.id;

        if (!booking_id) {
            return res.status(400).json({
                message: "Booking ID is required"
            });
        }

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

        if (booking.status === "CANCELLED") {
            return res.status(400).json({
                message: "Cannot make payment for a cancelled booking"
            });
        }

        if (booking.status === "COMPLETED") {
            return res.status(400).json({
                message: "Booking is already completed"
            });
        }

        const existingPayment = await pool.query(
            `SELECT *
             FROM payments
             WHERE booking_id = $1`,
            [booking_id]
        );

        if (existingPayment.rows.length > 0) {
            const payment = existingPayment.rows[0];

            if (payment.status === "SUCCESS") {
                return res.status(400).json({
                    message: "Payment already completed for this booking"
                });
            }
        }

        const options = {
            amount: Math.round(Number(booking.total_amount) * 100),
            currency: "INR",
            receipt: `booking_${booking_id}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            message: "Razorpay order created successfully",
            key_id: process.env.RAZORPAY_KEY_ID,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            booking_id: booking.id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            booking_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            payment_method
        } = req.body;

        const userId = req.user.id;

        if (
            !booking_id ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment verification details are required"
            });
        }

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

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Payment verification failed"
            });
        }

        const existingPayment = await pool.query(
            `SELECT *
             FROM payments
             WHERE booking_id = $1`,
            [booking_id]
        );

        let payment;

        if (existingPayment.rows.length > 0) {
            const result = await pool.query(
                `UPDATE payments
                 SET payment_method = $1,
                     transaction_id = $2,
                     status = 'SUCCESS',
                     paid_at = CURRENT_TIMESTAMP
                 WHERE booking_id = $3
                 RETURNING *`,
                [
                    payment_method || "RAZORPAY",
                    razorpay_payment_id,
                    booking_id
                ]
            );

            payment = result.rows[0];

        } else {
            const booking = bookingResult.rows[0];

            const result = await pool.query(
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
                    payment_method || "RAZORPAY",
                    razorpay_payment_id,
                    "SUCCESS"
                ]
            );

            payment = result.rows[0];
        }

        await pool.query(
            `UPDATE bookings
             SET status = 'CONFIRMED',
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [booking_id]
        );

        res.status(200).json({
            message: "Payment verified successfully and booking confirmed",
            payment
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
    createPaymentOrder,
    verifyPayment,
    getMyPayments,
    getAllPayments,
    getPaymentById
};