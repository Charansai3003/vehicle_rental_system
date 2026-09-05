import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function MyPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/payments/my-payments",
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

        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="page-loading">
                Loading your payments...
            </div>
        );
    }

    return (
        <div className="my-payments-page">
            <div className="payments-header">
                <p>MY PAYMENTS</p>

                <h1>Payment History</h1>

                <span>
                    View all your completed vehicle rental payments.
                </span>
            </div>

            {payments.length === 0 ? (
                <div className="no-payments">
                    You don't have any payments yet.
                </div>
            ) : (
                <div className="payments-grid">
                    {payments.map((payment) => (
                        <div
                            className="payment-card"
                            key={payment.id}
                        >
                            <div className="payment-card-top">
                                <div>
                                    <h2>
                                        {payment.brand} {payment.model}
                                    </h2>

                                    <p>
                                        Booking #{payment.booking_id}
                                    </p>
                                </div>

                                <span
                                    className={`payment-status ${payment.status.toLowerCase()}`}
                                >
                                    {payment.status}
                                </span>
                            </div>

                            <div className="payment-info">
                                <div>
                                    <span>Payment Method</span>

                                    <strong>
                                        {payment.payment_method}
                                    </strong>
                                </div>

                                <div>
                                    <span>Transaction ID</span>

                                    <strong className="transaction-id">
                                        {payment.transaction_id}
                                    </strong>
                                </div>
                            </div>

                            <div className="payment-dates-info">
                                <div>
                                    <span>Rental Start</span>

                                    <strong>
                                        {new Date(
                                            payment.start_date
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>

                                <div>
                                    <span>Rental End</span>

                                    <strong>
                                        {new Date(
                                            payment.end_date
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>
                            </div>

                            <div className="payment-card-footer">
                                <div>
                                    <span>Amount Paid</span>

                                    <strong>
                                        ₹{payment.amount}
                                    </strong>
                                </div>

                                <span className="payment-date">
                                    Paid on{" "}
                                    {new Date(
                                        payment.paid_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyPayments;