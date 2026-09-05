import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/vehicles"
                );

                setVehicles(response.data.vehicles);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load vehicles"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) {
        return (
            <div className="page-loading">
                Loading vehicles...
            </div>
        );
    }

    return (
        <div className="vehicles-page">
            <div className="vehicles-header">
                <p>FIND YOUR RIDE</p>
                <h1>Explore Our Vehicles</h1>
                <span>
                    Choose the perfect vehicle for your next journey.
                </span>
            </div>

            {vehicles.length === 0 ? (
                <div className="no-vehicles">
                    No vehicles available right now.
                </div>
            ) : (
                <div className="vehicle-grid">
                    {vehicles.map((vehicle) => (
                        <div className="vehicle-card" key={vehicle.id}>
                            <div className="vehicle-image">
                                {vehicle.image_url ? (
                                    <img
                                        src={vehicle.image_url}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                    />
                                ) : (
                                    <div className="vehicle-placeholder">
                                        🚗
                                    </div>
                                )}

                                <span
                                    className={`vehicle-status ${vehicle.status.toLowerCase()}`}
                                >
                                    {vehicle.status}
                                </span>
                            </div>

                            <div className="vehicle-info">
                                <div className="vehicle-title">
                                    <div>
                                        <h2>
                                            {vehicle.brand} {vehicle.model}
                                        </h2>

                                        <p>
                                            {vehicle.category_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="vehicle-details">
                                    <span>⛽ {vehicle.fuel_type}</span>
                                    <span>⚙️ {vehicle.transmission}</span>
                                    <span>👥 {vehicle.seats} Seats</span>
                                </div>

                                <div className="vehicle-footer">
                                    <div className="vehicle-price">
                                        <strong>
                                            ₹{vehicle.price_per_day}
                                        </strong>
                                        <span>/ day</span>
                                    </div>

                                    <Link
                                        to={`/vehicles/${vehicle.id}`}
                                        className="view-details-btn"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Vehicles;