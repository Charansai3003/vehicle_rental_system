import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function VehicleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const handleBookNow = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login to book a vehicle");
            navigate("/login");
            return;
        }

        navigate(`/booking/${id}`);
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading vehicle...
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="no-vehicles">
                Vehicle not found.
            </div>
        );
    }

    return (
        <div className="vehicle-details-page">
            <Link to="/vehicles" className="back-btn">
                ← Back to Vehicles
            </Link>

            <div className="vehicle-details-container">
                <div className="vehicle-details-image">
                    {vehicle.image_url ? (
                        <img
                            src={vehicle.image_url}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                        />
                    ) : (
                        <div className="vehicle-details-placeholder">
                            🚗
                        </div>
                    )}
                </div>

                <div className="vehicle-details-info">
                    <p className="vehicle-category">
                        {vehicle.category_name}
                    </p>

                    <h1>
                        {vehicle.brand} {vehicle.model}
                    </h1>

                    <p className="vehicle-year">
                        {vehicle.year} Model
                    </p>

                    <div className="vehicle-specs">
                        <div>
                            <span>Fuel Type</span>
                            <strong>{vehicle.fuel_type}</strong>
                        </div>

                        <div>
                            <span>Transmission</span>
                            <strong>{vehicle.transmission}</strong>
                        </div>

                        <div>
                            <span>Seats</span>
                            <strong>{vehicle.seats}</strong>
                        </div>
                    </div>

                    <div className="details-price">
                        <strong>₹{vehicle.price_per_day}</strong>
                        <span> / day</span>
                    </div>

                    <button
                        className="book-now-btn"
                        onClick={handleBookNow}
                        disabled={vehicle.status !== "AVAILABLE"}
                    >
                        {vehicle.status === "AVAILABLE"
                            ? "Book Now"
                            : "Currently Unavailable"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VehicleDetails;