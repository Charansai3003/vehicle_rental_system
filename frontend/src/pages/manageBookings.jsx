import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ManageBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/bookings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings(response.data.bookings);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = async (bookingId, status) => {
        try {
            setUpdatingId(bookingId);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/status`,
                {
                    status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(
                response.data.message ||
                "Booking status updated successfully"
            );

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking.id === bookingId
                        ? {
                            ...booking,
                            status
                        }
                        : booking
                )
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update booking status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="admin-page-loading">
                Loading bookings...
            </div>
        );
    }

    return (
        <div className="admin-bookings-page">
            <div className="admin-page-header">
                <div>
                    <p>ADMIN PANEL</p>
                    <h1>Manage Bookings</h1>
                    <span>
                        View and manage all vehicle bookings.
                    </span>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchBookings}
                >
                    Refresh
                </button>
            </div>

            <div className="admin-bookings-container">
                {bookings.length === 0 ? (
                    <div className="admin-empty-message">
                        No bookings found.
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div
                            className="admin-booking-card"
                            key={booking.id}
                        >
                            <div className="admin-booking-top">
                                <div>
                                    <span className="booking-id">
                                        Booking #{booking.id}
                                    </span>

                                    <h2>
                                        {booking.brand}{" "}
                                        {booking.model}
                                    </h2>
                                </div>

                                <span
                                    className={`booking-status ${booking.status.toLowerCase()}`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <div className="admin-booking-details">
                                <div>
                                    <span>Customer</span>
                                    <strong>
                                        {booking.user_name}
                                    </strong>
                                </div>

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
                                    <span>Total Amount</span>
                                    <strong>
                                        ₹{booking.total_amount}
                                    </strong>
                                </div>
                            </div>

                            <div className="admin-booking-actions">
                                <span>Update Status</span>

                                <select
                                    value={booking.status}
                                    disabled={
                                        updatingId === booking.id
                                    }
                                    onChange={(e) =>
                                        handleStatusChange(
                                            booking.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="PENDING">
                                        PENDING
                                    </option>

                                    <option value="CONFIRMED">
                                        CONFIRMED
                                    </option>

                                    <option value="COMPLETED">
                                        COMPLETED
                                    </option>

                                    <option value="CANCELLED">
                                        CANCELLED
                                    </option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageBookings;