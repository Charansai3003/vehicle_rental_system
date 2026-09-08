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
                    `${import.meta.env.VITE_API_URL}/vehicles`
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
            <div className="vehicles-loading-page">
                <div className="vehicles-loader"></div>
                <p>Finding the best vehicles for you...</p>
            </div>
        );
    }

    return (
        <div className="vehicles-page">
            <div className="vehicles-header">
                <div className="vehicles-header-badge">
                    <span></span>
                    OUR FLEET
                </div>

                <p>FIND YOUR RIDE</p>

                <h1>
                    Explore Our
                    <span> Vehicles</span>
                </h1>

                <span className="vehicles-header-description">
                    Choose the perfect vehicle for your next journey.
                    From everyday drives to unforgettable adventures.
                </span>
            </div>

            {vehicles.length === 0 ? (
                <div className="no-vehicles">
                    <div className="no-vehicles-icon">🚗</div>

                    <h2>No Vehicles Available</h2>

                    <p>
                        There are no vehicles available right now.
                        Please check again later.
                    </p>
                </div>
            ) : (
                <div className="vehicle-grid">
                    {vehicles.map((vehicle) => (
                        <div
                            className="vehicle-card"
                            key={vehicle.id}
                        >
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

                                <div className="vehicle-image-overlay"></div>

                                <span
                                    className={`vehicle-status ${vehicle.status.toLowerCase()}`}
                                >
                                    <span className="status-dot"></span>
                                    {vehicle.status}
                                </span>

                                <span className="vehicle-category-badge">
                                    {vehicle.category_name}
                                </span>
                            </div>

                            <div className="vehicle-info">
                                <div className="vehicle-title">
                                    <h2>
                                        {vehicle.brand} {vehicle.model}
                                    </h2>

                                    <p>
                                        {vehicle.year} •{" "}
                                        {vehicle.category_name}
                                    </p>
                                </div>

                                <div className="vehicle-details">
                                    <div className="vehicle-detail">
                                        <span className="vehicle-detail-icon">
                                            ⛽
                                        </span>

                                        <div>
                                            <span>Fuel</span>
                                            <strong>
                                                {vehicle.fuel_type}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="vehicle-detail">
                                        <span className="vehicle-detail-icon">
                                            ⚙
                                        </span>

                                        <div>
                                            <span>Transmission</span>
                                            <strong>
                                                {vehicle.transmission}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="vehicle-detail">
                                        <span className="vehicle-detail-icon">
                                            👥
                                        </span>

                                        <div>
                                            <span>Seats</span>
                                            <strong>
                                                {vehicle.seats}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="vehicle-footer">
                                    <div className="vehicle-price">
                                        <span>Starting from</span>

                                        <div>
                                            <strong>
                                                ₹{vehicle.price_per_day}
                                            </strong>

                                            <small>/ day</small>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/vehicles/${vehicle.id}`}
                                        className="view-details-btn"
                                    >
                                        View Details
                                        <span>→</span>
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