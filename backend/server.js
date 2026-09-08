require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://vehicle-rental-system-sigma-one.vercel.app"
];

app.use(
    cors({
        origin: allowedOrigins
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Vehicle Rental System Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});