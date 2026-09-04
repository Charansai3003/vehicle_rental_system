const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {
        const usersResult = await pool.query(
            `SELECT COUNT(*) FROM users`
        );

        const vehiclesResult = await pool.query(
            `SELECT COUNT(*) FROM vehicles`
        );

        const availableVehiclesResult = await pool.query(
            `SELECT COUNT(*)
             FROM vehicles
             WHERE status = 'AVAILABLE'`
        );

        const bookingsResult = await pool.query(
            `SELECT COUNT(*) FROM bookings`
        );

        const pendingBookingsResult = await pool.query(
            `SELECT COUNT(*)
             FROM bookings
             WHERE status = 'PENDING'`
        );

        const confirmedBookingsResult = await pool.query(
            `SELECT COUNT(*)
             FROM bookings
             WHERE status = 'CONFIRMED'`
        );

        const completedBookingsResult = await pool.query(
            `SELECT COUNT(*)
             FROM bookings
             WHERE status = 'COMPLETED'`
        );

        const cancelledBookingsResult = await pool.query(
            `SELECT COUNT(*)
             FROM bookings
             WHERE status = 'CANCELLED'`
        );

        const revenueResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_revenue
             FROM payments
             WHERE status = 'SUCCESS'`
        );

        const recentBookingsResult = await pool.query(
            `SELECT
                bookings.id,
                users.name AS user_name,
                vehicles.brand,
                vehicles.model,
                bookings.start_date,
                bookings.end_date,
                bookings.total_amount,
                bookings.status,
                bookings.created_at
            FROM bookings
            JOIN users ON bookings.user_id = users.id
            JOIN vehicles ON bookings.vehicle_id = vehicles.id
            ORDER BY bookings.created_at DESC
            LIMIT 5`
        );

        res.status(200).json({
            totalUsers: Number(usersResult.rows[0].count),
            totalVehicles: Number(vehiclesResult.rows[0].count),
            availableVehicles: Number(
                availableVehiclesResult.rows[0].count
            ),
            totalBookings: Number(bookingsResult.rows[0].count),
            pendingBookings: Number(
                pendingBookingsResult.rows[0].count
            ),
            confirmedBookings: Number(
                confirmedBookingsResult.rows[0].count
            ),
            completedBookings: Number(
                completedBookingsResult.rows[0].count
            ),
            cancelledBookings: Number(
                cancelledBookingsResult.rows[0].count
            ),
            totalRevenue: Number(
                revenueResult.rows[0].total_revenue
            ),
            recentBookings: recentBookingsResult.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboardStats
};