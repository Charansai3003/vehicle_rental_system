const pool = require("../config/db");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const userResult = await pool.query(
            `SELECT id, name, email, phone, role, created_at
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: userResult.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getUserProfile
};