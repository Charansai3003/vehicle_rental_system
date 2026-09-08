import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ManagePayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/payments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPayments(response.data.payments);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load payments"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="admin-page-loading">
                Loading payments...
            </div>
        );
    }

    return (
        <div className="admin-payments-page">
            <div className="admin-page-header">
                <div>
                    <p>ADMIN PANEL</p>

                    <h1>Manage Payments</h1>

                    <span>
                        View all customer payment transactions.
                    </span>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchPayments}
                >
                    Refresh
                </button>
            </div>

            <div className="admin-payments-container">
                {payments.length === 0 ? (
                    <div className="admin-empty-message">
                        No payments found.
                    </div>
                ) : (
                    payments.map((payment) => (
                        <div
                            className="admin-payment-card"
                            key={payment.id}
                        >
                            <div className="admin-payment-top">
                                <div>
                                    <span className="payment-id">
                                        Payment #{payment.id}
                                    </span>

                                    <h2>
                                        {payment.brand}{" "}
                                        {payment.model}
                                    </h2>
                                </div>

                                <span
                                    className={`payment-status ${payment.status.toLowerCase()}`}
                                >
                                    {payment.status}
                                </span>
                            </div>

                            <div className="admin-payment-details">
                                <div>
                                    <span>Booking ID</span>
                                    <strong>
                                        #{payment.booking_id}
                                    </strong>
                                </div>

                                <div>
                                    <span>Customer</span>
                                    <strong>
                                        {payment.user_name ||
                                            "Customer"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Amount</span>
                                    <strong>
                                        ₹{payment.amount}
                                    </strong>
                                </div>

                                <div>
                                    <span>Payment Method</span>
                                    <strong>
                                        {payment.payment_method ||
                                            "Razorpay"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Transaction ID</span>
                                    <strong>
                                        {payment.transaction_id ||
                                            "N/A"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Paid At</span>
                                    <strong>
                                        {payment.paid_at
                                            ? new Date(
                                                payment.paid_at
                                            ).toLocaleString()
                                            : "N/A"}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManagePayments;