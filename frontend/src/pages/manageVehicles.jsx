import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ManageVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const [formData, setFormData] = useState({
        category_id: "",
        brand: "",
        model: "",
        registration_number: "",
        year: "",
        fuel_type: "PETROL",
        transmission: "MANUAL",
        seats: "",
        price_per_day: "",
        status: "AVAILABLE",
        image_url: ""
    });

    const fetchVehicles = async () => {
        try {
            setLoading(true);

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

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            category_id: "",
            brand: "",
            model: "",
            registration_number: "",
            year: "",
            fuel_type: "PETROL",
            transmission: "MANUAL",
            seats: "",
            price_per_day: "",
            status: "AVAILABLE",
            image_url: ""
        });

        setEditingVehicle(null);
        setShowForm(false);
    };

    const handleAddVehicle = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEditVehicle = (vehicle) => {
        setEditingVehicle(vehicle);

        setFormData({
            category_id: vehicle.category_id || "",
            brand: vehicle.brand || "",
            model: vehicle.model || "",
            registration_number:
                vehicle.registration_number || "",
            year: vehicle.year || "",
            fuel_type: vehicle.fuel_type || "PETROL",
            transmission:
                vehicle.transmission || "MANUAL",
            seats: vehicle.seats || "",
            price_per_day:
                vehicle.price_per_day || "",
            status: vehicle.status || "AVAILABLE",
            image_url: vehicle.image_url || ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const data = {
                category_id: Number(formData.category_id),
                brand: formData.brand.trim(),
                model: formData.model.trim(),
                registration_number:
                    formData.registration_number.trim(),
                year: Number(formData.year),
                fuel_type: formData.fuel_type,
                transmission: formData.transmission,
                seats: Number(formData.seats),
                price_per_day: Number(formData.price_per_day),
                status: formData.status,
                image_url: formData.image_url.trim()
            };

            if (editingVehicle) {
                const response = await axios.put(
                    `http://localhost:5000/api/vehicles/${editingVehicle.id}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                toast.success(
                    response.data.message ||
                    "Vehicle updated successfully"
                );
            } else {
                const response = await axios.post(
                    "http://localhost:5000/api/vehicles",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                toast.success(
                    response.data.message ||
                    "Vehicle added successfully"
                );
            }

            resetForm();
            fetchVehicles();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save vehicle"
            );
        }
    };

    const handleDeleteVehicle = async (vehicleId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this vehicle?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const response = await axios.delete(
                `http://localhost:5000/api/vehicles/${vehicleId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(
                response.data.message ||
                "Vehicle deleted successfully"
            );

            setVehicles((previousVehicles) =>
                previousVehicles.filter(
                    (vehicle) => vehicle.id !== vehicleId
                )
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete vehicle"
            );
        }
    };

    if (loading) {
        return (
            <div className="admin-page-loading">
                Loading vehicles...
            </div>
        );
    }

    return (
        <div className="admin-vehicles-page">

            <div className="admin-page-header">
                <div>
                    <p>ADMIN PANEL</p>

                    <h1>Manage Vehicles</h1>

                    <span>
                        Add, update and manage rental vehicles.
                    </span>
                </div>

                <button
                    className="add-vehicle-btn"
                    onClick={handleAddVehicle}
                >
                    + Add Vehicle
                </button>
            </div>

            {showForm && (
                <div className="vehicle-form-container">

                    <div className="vehicle-form-header">
                        <div>
                            <h2>
                                {editingVehicle
                                    ? "Edit Vehicle"
                                    : "Add New Vehicle"}
                            </h2>

                            <span>
                                Enter the vehicle details below.
                            </span>
                        </div>

                        <button
                            className="close-form-btn"
                            onClick={resetForm}
                        >
                            ✕
                        </button>
                    </div>

                    <form
                        className="vehicle-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="vehicle-form-grid">

                            <div className="form-group">
                                <label>Category ID</label>

                                <input
                                    type="number"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Brand</label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="Toyota"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Model</label>

                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    placeholder="Fortuner"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Registration Number</label>

                                <input
                                    type="text"
                                    name="registration_number"
                                    value={
                                        formData.registration_number
                                    }
                                    onChange={handleInputChange}
                                    placeholder="AP01AB1234"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Year</label>

                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    placeholder="2025"
                                    required
                                    min="1900"
                                />
                            </div>

                            <div className="form-group">
                                <label>Fuel Type</label>

                                <select
                                    name="fuel_type"
                                    value={formData.fuel_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="PETROL">
                                        Petrol
                                    </option>

                                    <option value="DIESEL">
                                        Diesel
                                    </option>

                                    <option value="ELECTRIC">
                                        Electric
                                    </option>

                                    <option value="HYBRID">
                                        Hybrid
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Transmission</label>

                                <select
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="MANUAL">
                                        Manual
                                    </option>

                                    <option value="AUTOMATIC">
                                        Automatic
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Seats</label>

                                <input
                                    type="number"
                                    name="seats"
                                    value={formData.seats}
                                    onChange={handleInputChange}
                                    placeholder="5"
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Price Per Day</label>

                                <input
                                    type="number"
                                    name="price_per_day"
                                    value={formData.price_per_day}
                                    onChange={handleInputChange}
                                    placeholder="2500"
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Status</label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="AVAILABLE">
                                        Available
                                    </option>

                                    <option value="UNAVAILABLE">
                                        Unavailable
                                    </option>

                                    <option value="MAINTENANCE">
                                        Maintenance
                                    </option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Image URL</label>

                                <input
                                    type="text"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/car.jpg"
                                />
                            </div>

                        </div>

                        <div className="vehicle-form-actions">

                            <button
                                type="button"
                                className="cancel-form-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-vehicle-btn"
                            >
                                {editingVehicle
                                    ? "Update Vehicle"
                                    : "Add Vehicle"}
                            </button>

                        </div>

                    </form>
                </div>
            )}

            <div className="admin-vehicles-container">

                {vehicles.length === 0 ? (
                    <div className="admin-empty-message">
                        No vehicles found.
                    </div>
                ) : (
                    vehicles.map((vehicle) => (
                        <div
                            className="admin-vehicle-card"
                            key={vehicle.id}
                        >

                            <div className="admin-vehicle-image">
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
                            </div>

                            <div className="admin-vehicle-content">

                                <div className="admin-vehicle-top">

                                    <div>
                                        <span>
                                            Vehicle #{vehicle.id}
                                        </span>

                                        <h2>
                                            {vehicle.brand}{" "}
                                            {vehicle.model}
                                        </h2>
                                    </div>

                                    <span
                                        className={`vehicle-status ${vehicle.status.toLowerCase()}`}
                                    >
                                        {vehicle.status}
                                    </span>

                                </div>

                                <div className="admin-vehicle-details">

                                    <div>
                                        <span>Category</span>

                                        <strong>
                                            {vehicle.category_name ||
                                                `Category #${vehicle.category_id}`}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Registration</span>

                                        <strong>
                                            {
                                                vehicle.registration_number
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Year</span>

                                        <strong>
                                            {vehicle.year}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Fuel</span>

                                        <strong>
                                            {vehicle.fuel_type}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Transmission</span>

                                        <strong>
                                            {vehicle.transmission}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Seats</span>

                                        <strong>
                                            {vehicle.seats}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Price / Day</span>

                                        <strong>
                                            ₹{vehicle.price_per_day}
                                        </strong>
                                    </div>

                                </div>

                                <div className="admin-vehicle-actions">

                                    <button
                                        className="edit-vehicle-btn"
                                        onClick={() =>
                                            handleEditVehicle(
                                                vehicle
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-vehicle-btn"
                                        onClick={() =>
                                            handleDeleteVehicle(
                                                vehicle.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default ManageVehicles;