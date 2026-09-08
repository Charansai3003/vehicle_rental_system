import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/admin/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="admin-page-loading">
                Loading dashboard...
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="admin-empty-message">
                Dashboard data not available.
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <p>ADMIN PANEL</p>

                    <h1>Dashboard</h1>

                    <span>
                        Overview of your vehicle rental system.
                    </span>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchDashboard}
                >
                    Refresh
                </button>
            </div>

            <div className="dashboard-stats">

                <div className="dashboard-card">
                    <span>Total Users</span>
                    <strong>{stats.totalUsers}</strong>
                </div>

                <div className="dashboard-card">
                    <span>Total Vehicles</span>
                    <strong>{stats.totalVehicles}</strong>
                </div>

                <div className="dashboard-card">
                    <span>Available Vehicles</span>
                    <strong>{stats.availableVehicles}</strong>
                </div>

                <div className="dashboard-card">
                    <span>Total Bookings</span>
                    <strong>{stats.totalBookings}</strong>
                </div>

            </div>

            <div className="dashboard-section">

                <div className="dashboard-section-header">
                    <div>
                        <h2>Booking Overview</h2>

                        <span>
                            Current booking status summary
                        </span>
                    </div>
                </div>

                <div className="booking-overview">

                    <div className="booking-stat pending">
                        <span>Pending</span>
                        <strong>
                            {stats.pendingBookings}
                        </strong>
                    </div>

                    <div className="booking-stat confirmed">
                        <span>Confirmed</span>
                        <strong>
                            {stats.confirmedBookings}
                        </strong>
                    </div>

                    <div className="booking-stat completed">
                        <span>Completed</span>
                        <strong>
                            {stats.completedBookings}
                        </strong>
                    </div>

                    <div className="booking-stat cancelled">
                        <span>Cancelled</span>
                        <strong>
                            {stats.cancelledBookings}
                        </strong>
                    </div>

                </div>

            </div>

            <div className="dashboard-section">

                <div className="revenue-card">

                    <div>
                        <span>Total Revenue</span>

                        <h2>
                            ₹{stats.totalRevenue.toLocaleString("en-IN")}
                        </h2>
                    </div>

                    <div className="revenue-icon">
                        ₹
                    </div>

                </div>

            </div>

            <div className="dashboard-section">

                <div className="dashboard-section-header">
                    <div>
                        <h2>Recent Bookings</h2>

                        <span>
                            Latest five bookings
                        </span>
                    </div>
                </div>

                {stats.recentBookings.length === 0 ? (
                    <div className="admin-empty-message">
                        No recent bookings found.
                    </div>
                ) : (
                    <div className="recent-bookings">

                        {stats.recentBookings.map((booking) => (
                            <div
                                className="recent-booking-card"
                                key={booking.id}
                            >
                                <div className="recent-booking-main">

                                    <div>
                                        <span className="recent-booking-id">
                                            Booking #{booking.id}
                                        </span>

                                        <h3>
                                            {booking.brand}{" "}
                                            {booking.model}
                                        </h3>

                                        <p>
                                            Customer:{" "}
                                            {booking.user_name}
                                        </p>
                                    </div>

                                    <span
                                        className={`booking-status ${booking.status.toLowerCase()}`}
                                    >
                                        {booking.status}
                                    </span>

                                </div>

                                <div className="recent-booking-info">

                                    <div>
                                        <span>Start Date</span>
                                        <strong>
                                            {new Date(
                                                booking.start_date
                                            ).toLocaleDateString()}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>End Date</span>
                                        <strong>
                                            {new Date(
                                                booking.end_date
                                            ).toLocaleDateString()}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Amount</span>
                                        <strong>
                                            ₹{booking.total_amount}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Booked On</span>
                                        <strong>
                                            {new Date(
                                                booking.created_at
                                            ).toLocaleDateString()}
                                        </strong>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Dashboard;