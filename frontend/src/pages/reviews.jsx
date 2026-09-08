import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Reviews() {
    const [completedBookings, setCompletedBookings] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [bookingId, setBookingId] = useState("");
    const [vehicleId, setVehicleId] = useState("");

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchCompletedBookings = async () => {
        try {
            setLoadingBookings(true);

            const token = getToken();

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/bookings/my-bookings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const bookings = response.data.bookings || [];

            const completed = bookings.filter(
                (booking) =>
                    String(booking.status).toUpperCase() ===
                    "COMPLETED"
            );

            setCompletedBookings(completed);

            if (completed.length > 0) {
                const firstBooking = completed[0];

                setBookingId(String(firstBooking.id));

                if (firstBooking.vehicle_id) {
                    setVehicleId(
                        String(firstBooking.vehicle_id)
                    );
                }
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load completed bookings"
            );
        } finally {
            setLoadingBookings(false);
        }
    };

    const fetchBookingDetails = async (id) => {
        if (!id) {
            setVehicleId("");
            return;
        }

        try {
            const token = getToken();

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/bookings/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const booking = response.data.booking;

            if (!booking || !booking.vehicle_id) {
                toast.error(
                    "Vehicle information could not be found"
                );
                setVehicleId("");
                return;
            }

            setVehicleId(String(booking.vehicle_id));
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load booking details"
            );

            setVehicleId("");
        }
    };

    const fetchReviews = async (id) => {
        if (!id) {
            setReviews([]);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/reviews/vehicle/${id}`
            );

            setReviews(response.data.reviews || []);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load reviews"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedBookings();
    }, []);

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails(bookingId);
        }
    }, [bookingId]);

    useEffect(() => {
        if (vehicleId) {
            fetchReviews(vehicleId);
        }
    }, [vehicleId]);

    const handleBookingChange = (e) => {
        const selectedBookingId = e.target.value;

        setBookingId(selectedBookingId);
        setVehicleId("");
        setRating(5);
        setComment("");
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!bookingId) {
            toast.error("Please select a completed booking");
            return;
        }

        if (!vehicleId) {
            toast.error(
                "Vehicle information could not be found"
            );
            return;
        }

        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        try {
            setSubmitting(true);

            const token = getToken();

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/reviews`,
                {
                    vehicle_id: Number(vehicleId),
                    rating: Number(rating),
                    comment: comment.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(
                response.data.message ||
                "Review added successfully"
            );

            setComment("");
            setRating(5);

            fetchReviews(vehicleId);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to add review"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const selectedBooking = completedBookings.find(
        (booking) =>
            String(booking.id) === String(bookingId)
    );

    return (
        <div className="reviews-page">

            <div className="reviews-header">
                <p>VEHICLE REVIEWS</p>

                <h1>Customer Reviews</h1>

                <span>
                    See what customers think about our vehicles.
                </span>
            </div>

            <div className="reviews-container">

                {loadingBookings ? (
                    <div className="reviews-message">
                        Loading your completed bookings...
                    </div>
                ) : completedBookings.length === 0 ? (
                    <div className="reviews-message">
                        You don't have any completed bookings yet.
                        Complete a booking to write a review.
                    </div>
                ) : (
                    <>
                        <div className="review-search">

                            <div className="review-vehicle-select">

                                <label>
                                    Select a completed booking
                                </label>

                                <select
                                    value={bookingId}
                                    onChange={handleBookingChange}
                                >
                                    {completedBookings.map(
                                        (booking) => (
                                            <option
                                                key={booking.id}
                                                value={booking.id}
                                            >
                                                Booking #{booking.id} -{" "}
                                                {booking.brand}{" "}
                                                {booking.model}
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                        </div>

                        <form
                            className="review-form"
                            onSubmit={handleSubmitReview}
                        >
                            <h2>Write a Review</h2>

                            {selectedBooking && (
                                <p>
                                    Reviewing:{" "}
                                    <strong>
                                        {selectedBooking.brand}{" "}
                                        {selectedBooking.model}
                                    </strong>
                                </p>
                            )}

                            <div className="rating-input">

                                <label>Rating</label>

                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                className={
                                                    star <= rating
                                                        ? "star active"
                                                        : "star"
                                                }
                                                onClick={() =>
                                                    setRating(star)
                                                }
                                            >
                                                ★
                                            </button>
                                        )
                                    )}
                                </div>

                            </div>

                            <div className="review-comment">

                                <label>Comment</label>

                                <textarea
                                    placeholder="Write your experience..."
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(e.target.value)
                                    }
                                    rows="4"
                                />

                            </div>

                            <button
                                type="submit"
                                className="submit-review-btn"
                                disabled={
                                    submitting ||
                                    !vehicleId
                                }
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>

                        </form>
                    </>
                )}

                <div className="reviews-list">

                    <div className="reviews-list-header">

                        <h2>Reviews</h2>

                        {vehicleId && (
                            <span>
                                Vehicle #{vehicleId}
                            </span>
                        )}

                    </div>

                    {loading ? (
                        <div className="reviews-message">
                            Loading reviews...
                        </div>
                    ) : !vehicleId ? (
                        <div className="reviews-message">
                            Select a completed booking to view
                            reviews.
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="reviews-message">
                            No reviews found for this vehicle.
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div
                                className="review-card"
                                key={review.id}
                            >

                                <div className="review-card-top">

                                    <div>
                                        <h3>
                                            {review.user_name}
                                        </h3>

                                        <span>
                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="review-rating">
                                        {"★".repeat(
                                            review.rating
                                        )}

                                        {"☆".repeat(
                                            5 - review.rating
                                        )}
                                    </div>

                                </div>

                                {review.comment && (
                                    <p className="review-text">
                                        {review.comment}
                                    </p>
                                )}

                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
}

export default Reviews;