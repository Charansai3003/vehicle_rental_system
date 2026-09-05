import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function MyBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/bookings/my-bookings",
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

    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            setCancellingId(bookingId);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:5000/api/bookings/${bookingId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === bookingId
                        ? {
                            ...booking,
                            status: "CANCELLED"
                        }
                        : booking
                )
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to cancel booking"
            );
        } finally {
            setCancellingId(null);
        }
    };

    const canCancelBooking = (booking) => {
        return (
            booking.status === "PENDING" ||
            booking.status === "CONFIRMED"
        );
    };

    const handlePayment = (bookingId) => {
        navigate(`/payment/${bookingId}`);
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading your bookings...
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <div className="bookings-header">
                <p>MY BOOKINGS</p>

                <h1>Your Rental Bookings</h1>

                <span>
                    View and manage all your vehicle bookings.
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    You don't have any bookings yet.
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map((booking) => (
                        <div
                            className="booking-card"
                            key={booking.id}
                        >
                            <div className="booking-card-top">
                                <div>
                                    <h2>
                                        {booking.brand} {booking.model}
                                    </h2>

                                    <p>
                                        Booking #{booking.id}
                                    </p>
                                </div>

                                <span
                                    className={`booking-status ${booking.status.toLowerCase()}`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <div className="booking-dates">
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
                            </div>

                            <div className="booking-card-footer">
                                <div>
                                    <span>Total Amount</span>

                                    <strong>
                                        ₹{booking.total_amount}
                                    </strong>
                                </div>

                                <span className="booking-created">
                                    Booked on{" "}
                                    {new Date(
                                        booking.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            {booking.status === "PENDING" && (
                                <button
                                    className="pay-booking-btn"
                                    onClick={() =>
                                        handlePayment(booking.id)
                                    }
                                >
                                    Pay Now
                                </button>
                            )}

                            {canCancelBooking(booking) && (
                                <button
                                    className="cancel-booking-btn"
                                    onClick={() =>
                                        handleCancelBooking(booking.id)
                                    }
                                    disabled={
                                        cancellingId === booking.id
                                    }
                                >
                                    {cancellingId === booking.id
                                        ? "Cancelling..."
                                        : "Cancel Booking"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookings;