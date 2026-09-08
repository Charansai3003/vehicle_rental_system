import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        PREMIUM VEHICLE RENTALS
                    </div>

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
                            <span className="btn-arrow">→</span>
                        </Link>

                        <Link to="/register" className="secondary-btn">
                            Get Started
                        </Link>
                    </div>

                    <div className="hero-trust">
                        <div className="trust-item">
                            <strong>30+</strong>
                            <span>Vehicles</span>
                        </div>

                        <div className="trust-divider"></div>

                        <div className="trust-item">
                            <strong>5</strong>
                            <span>Categories</span>
                        </div>

                        <div className="trust-divider"></div>

                        <div className="trust-item">
                            <strong>24/7</strong>
                            <span>Easy Booking</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-glow"></div>
                    <div className="hero-circle"></div>

                    <div className="hero-car">
                        <img
                            src="/vehicles/toyota-fortuner.jpg"
                            alt="Toyota Fortuner"
                        />
                    </div>

                    <div className="floating-card card-one">
                        <div className="floating-icon">✓</div>

                        <div>
                            <strong>30+</strong>
                            <span>Vehicles Available</span>
                        </div>
                    </div>

                    <div className="floating-card card-two">
                        <div className="floating-icon">⚡</div>

                        <div>
                            <strong>Easy Booking</strong>
                            <span>Fast & Secure</span>
                        </div>
                    </div>

                    <div className="floating-card card-three">
                        <div className="rating-stars">★★★★★</div>
                        <span>Trusted Experience</span>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="section-heading">
                    <p>WHY CHOOSE US</p>

                    <h2>
                        Everything You Need
                        <span> for a Smooth Ride</span>
                    </h2>

                    <div className="heading-line"></div>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-number">01</div>

                        <div className="feature-icon">🚘</div>

                        <h3>Wide Selection</h3>

                        <p>
                            Choose from a variety of vehicles for every
                            type of journey.
                        </p>

                        <div className="feature-arrow">→</div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-number">02</div>

                        <div className="feature-icon">⚡</div>

                        <h3>Quick Booking</h3>

                        <p>
                            Book your preferred vehicle in just a few
                            simple steps.
                        </p>

                        <div className="feature-arrow">→</div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-number">03</div>

                        <div className="feature-icon">🔒</div>

                        <h3>Secure Payments</h3>

                        <p>
                            Enjoy a safe and reliable payment experience
                            for every booking.
                        </p>

                        <div className="feature-arrow">→</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;