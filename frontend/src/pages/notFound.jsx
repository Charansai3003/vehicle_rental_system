import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="not-found-number">
                    404
                </div>

                <h1>Page Not Found</h1>

                <p>
                    Sorry, the page you are looking for
                    doesn't exist or may have been moved.
                </p>

                <Link
                    to="/"
                    className="not-found-home-btn"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;