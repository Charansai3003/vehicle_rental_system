import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            toast.error("Please login to access the admin panel");
            navigate("/login", { replace: true });
            return;
        }

        try {
            const user = JSON.parse(storedUser);

            if (user.role !== "ADMIN") {
                toast.error("Access denied");
                navigate("/", { replace: true });
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            toast.error("Please login again");
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully");

        navigate("/login");
    };

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
        return null;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch (error) {
        return null;
    }

    if (user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="admin-layout">

            <aside className="admin-sidebar">

                <div className="admin-logo">
                    <h2>Vehicle Rental</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className="admin-nav">

                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        📊 Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/vehicles"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        🚗 Vehicles
                    </NavLink>

                    <NavLink
                        to="/admin/bookings"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        📋 Bookings
                    </NavLink>

                    <NavLink
                        to="/admin/payments"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        💳 Payments
                    </NavLink>

                </nav>

                <button
                    className="admin-logout-btn"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </aside>

            <main className="admin-main">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;