import { Routes, Route } from "react-router-dom";

import CustomerLayout from "./layouts/customerLayout";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Vehicles from "./pages/vehicles";
import VehicleDetails from "./pages/vehicleDetails";
import MyBookings from "./pages/myBookings";
import MyPayments from "./pages/myPayments";
import Reviews from "./pages/reviews";
import Dashboard from "./pages/dashboard";
import ManageVehicles from "./pages/manageVehicles";
import ManageBookings from "./pages/manageBookings";
import ManagePayments from "./pages/managePayments";
import NotFound from "./pages/notFound";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<CustomerLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/vehicles/:id" element={<VehicleDetails />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/my-payments" element={<MyPayments />} />
                <Route path="/reviews" element={<Reviews />} />
            </Route>

            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/vehicles" element={<ManageVehicles />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/payments" element={<ManagePayments />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;