import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-tag">RENT SMART. DRIVE FREE.</p>

                    <h1>
                        Find the Perfect Vehicle
                        <span> for Every Journey.</span>
                    </h1>

                    <p className="hero-description">
                        From city rides to weekend adventures, RentRide
                        makes vehicle rental simple, fast and reliable.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/vehicles" className="primary-btn">
                            Explore Vehicles
                        </Link>

                        <Link to="/register" className="secondary-btn">
                            Get Started
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-circle"></div>

                    <div className="car-placeholder">
                        🚗
                    </div>

                    <div className="floating-card card-one">
                        <strong>50+</strong>
                        <span>Vehicles Available</span>
                    </div>

                    <div className="floating-card card-two">
                        <strong>Easy Booking</strong>
                        <span>Fast & Secure</span>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="section-heading">
                    <p>WHY CHOOSE US</p>
                    <h2>Everything You Need for a Smooth Ride</h2>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚘</div>
                        <h3>Wide Selection</h3>
                        <p>
                            Choose from a variety of vehicles for every
                            type of journey.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Quick Booking</h3>
                        <p>
                            Book your preferred vehicle in just a few
                            simple steps.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure Payments</h3>
                        <p>
                            Enjoy a safe and reliable payment experience
                            for every booking.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;