import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Payment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:5000/api/bookings/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setBooking(response.data.booking);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load booking details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);

            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            setPaying(true);

            const razorpayLoaded =
                await loadRazorpayScript();

            if (!razorpayLoaded) {
                toast.error(
                    "Failed to load Razorpay. Please try again."
                );

                return;
            }

            const token = localStorage.getItem("token");

            const orderResponse = await axios.post(
                "http://localhost:5000/api/payments/create-order",
                {
                    booking_id: Number(id)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const order = orderResponse.data;

            const options = {
                key: order.key_id,

                amount: order.amount,

                currency: order.currency,

                name: "Vehicle Rental System",

                description: `Payment for Booking #${id}`,

                order_id: order.order_id,

                handler: async function (response) {
                    try {
                        const verifyResponse =
                            await axios.post(
                                "http://localhost:5000/api/payments/verify",
                                {
                                    booking_id: Number(id),

                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_signature:
                                        response.razorpay_signature,

                                    payment_method:
                                        paymentMethod
                                },
                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`
                                    }
                                }
                            );

                        toast.success(
                            verifyResponse.data.message ||
                            "Payment successful"
                        );

                        navigate("/my-payments");

                    } catch (error) {
                        toast.error(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );
                    } finally {
                        setPaying(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setPaying(false);

                        toast.error(
                            "Payment cancelled"
                        );
                    }
                },

                theme: {
                    color: "#2563eb"
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Payment failed"
            );

            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading payment details...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="no-bookings">
                Booking not found.
            </div>
        );
    }

    if (booking.status === "CONFIRMED") {
        return (
            <div className="no-bookings">
                This booking has already been paid.
            </div>
        );
    }

    if (booking.status === "CANCELLED") {
        return (
            <div className="no-bookings">
                Payment cannot be made for a cancelled booking.
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-container">

                <div className="payment-header">
                    <p>COMPLETE PAYMENT</p>

                    <h1>Confirm Your Payment</h1>

                    <span>
                        Complete the payment to confirm your vehicle booking.
                    </span>
                </div>

                <div className="payment-booking-details">
                    <h2>
                        {booking.brand} {booking.model}
                    </h2>

                    <p>
                        Booking #{booking.id}
                    </p>

                    <div className="payment-dates">
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

                    <div className="payment-amount">
                        <span>Total Amount</span>

                        <strong>
                            ₹{booking.total_amount}
                        </strong>
                    </div>
                </div>

                <div className="payment-methods">
                    <h2>Select Payment Method</h2>

                    <div className="payment-options">

                        <label
                            className={`payment-option ${
                                paymentMethod === "UPI"
                                    ? "selected"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={
                                    paymentMethod === "UPI"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <span>UPI</span>
                        </label>

                        <label
                            className={`payment-option ${
                                paymentMethod === "CARD"
                                    ? "selected"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="CARD"
                                checked={
                                    paymentMethod === "CARD"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <span>
                                Credit / Debit Card
                            </span>
                        </label>

                    </div>
                </div>

                <button
                    className="payment-btn"
                    onClick={handlePayment}
                    disabled={paying}
                >
                    {paying
                        ? "Processing..."
                        : `Pay ₹${booking.total_amount}`}
                </button>

            </div>
        </div>
    );
}

export default Payment;