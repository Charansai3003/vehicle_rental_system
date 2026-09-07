import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [vehicleId, setVehicleId] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async (id) => {
        if (!id) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.get(
                `http://localhost:5000/api/reviews/vehicle/${id}`
            );

            setReviews(response.data.reviews);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load reviews"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSearchReviews = (e) => {
        e.preventDefault();

        if (!vehicleId) {
            toast.error("Please enter a vehicle ID");
            return;
        }

        fetchReviews(vehicleId);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!vehicleId) {
            toast.error("Please enter a vehicle ID");
            return;
        }

        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        try {
            setSubmitting(true);

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/reviews",
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

            toast.success(response.data.message);

            setComment("");
            setRating(5);

            fetchReviews(vehicleId);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to add review"
            );
        } finally {
            setSubmitting(false);
        }
    };

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

                <form
                    className="review-search"
                    onSubmit={handleSearchReviews}
                >
                    <input
                        type="number"
                        placeholder="Enter vehicle ID"
                        value={vehicleId}
                        min="1"
                        onChange={(e) =>
                            setVehicleId(e.target.value)
                        }
                    />

                    <button type="submit">
                        View Reviews
                    </button>
                </form>

                <form
                    className="review-form"
                    onSubmit={handleSubmitReview}
                >
                    <h2>Write a Review</h2>

                    <div className="rating-input">
                        <label>Rating</label>

                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
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
                            ))}
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
                        disabled={submitting}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Review"}
                    </button>
                </form>

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
                                        {"★".repeat(review.rating)}
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