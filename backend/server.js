const express = require("express");

require("dotenv").config();

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Vehicle Rental System Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
