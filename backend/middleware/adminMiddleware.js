const authorizeAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

        next();

    } catch (error) {
        return res.status(403).json({
            message: "Access denied."
        });
    }
};

module.exports = authorizeAdmin;