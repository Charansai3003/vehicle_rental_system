import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                RentRide
            </Link>

            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/vehicles">Vehicles</Link>

                {token && (
                    <>
                        <Link to="/my-bookings">My Bookings</Link>
                        <Link to="/my-payments">My Payments</Link>
                        <Link to="/reviews">Reviews</Link>
                    </>
                )}
            </div>

            <div className="navbar-actions">
                {token ? (
                    <>
                        <span className="welcome-text">
                            Hi, {user?.name}
                        </span>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">
                            Login
                        </Link>

                        <Link to="/register" className="register-btn">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;