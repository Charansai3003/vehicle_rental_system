import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/vehicles/${id}`
                );

                setVehicle(response.data.vehicle);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load vehicle"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            toast.error("Please select both dates");
            return;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            toast.error("End date must be after start date");
            return;
        }

        try {
            setBookingLoading(true);

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/bookings",
                {
                    vehicle_id: Number(id),
                    start_date: startDate,
                    end_date: endDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Booking created successfully");

            navigate("/my-bookings");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create booking"
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <div className="page-loading">Loading...</div>;
    }

    if (!vehicle) {
        return <div className="no-vehicles">Vehicle not found.</div>;
    }

    return (
        <div className="booking-page">
            <div className="booking-container">

                <div className="booking-info">
                    <p>BOOK YOUR VEHICLE</p>

                    <h1>
                        {vehicle.brand} {vehicle.model}
                    </h1>

                    <div className="booking-vehicle-details">
                        <span>{vehicle.category_name}</span>
                        <span>{vehicle.fuel_type}</span>
                        <span>{vehicle.transmission}</span>
                        <span>{vehicle.seats} Seats</span>
                    </div>

                    <div className="booking-price">
                        <strong>₹{vehicle.price_per_day}</strong>
                        <span> per day</span>
                    </div>
                </div>

                <form
                    className="booking-form"
                    onSubmit={handleBooking}
                >
                    <h2>Select Your Rental Dates</h2>

                    <div className="form-group">
                        <label>Start Date</label>

                        <input
                            type="date"
                            value={startDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>

                        <input
                            type="date"
                            value={endDate}
                            min={
                                startDate ||
                                new Date().toISOString().split("T")[0]
                            }
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="booking-btn"
                        disabled={bookingLoading}
                    >
                        {bookingLoading
                            ? "Creating Booking..."
                            : "Confirm Booking"}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Booking;