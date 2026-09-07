# 🚗 Vehicle Rental System

A full-stack **Vehicle Rental System** that allows customers to browse vehicles, make bookings, complete online payments, and submit reviews. Administrators can manage vehicles, bookings, payments, and monitor the overall system through a dedicated admin dashboard.

The project is built using **React, Node.js, Express.js, PostgreSQL, and Razorpay**.

---

## 📌 Project Overview

The Vehicle Rental System provides a complete digital platform for managing vehicle rentals.

The application has two main types of users:

- 👤 Customer
- 🛠️ Admin

---

# 🛠️ Technologies Used
## Frontend:
- React.js
- Vite
- React Router DOM
- Axios
- React Hot Toast
- CSS
## Backend:
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- REST APIs
## Database:
- PostgreSQL
- pgAdmin
## Payment Gateway:
- Razorpay
- Razorpay Test Mode

---

### 👤 Customers can:

- Create an account and log in
- Browse available vehicles
- View detailed vehicle information
- Book vehicles for selected dates
- View their booking history
- Cancel eligible bookings
- Make online payments using Razorpay
- View payment history
- Submit vehicle reviews after completing a booking
- View reviews for vehicles

### 🛠️ Administrators can:

- Monitor overall system statistics
- Manage vehicles
- Manage customer bookings
- Update booking statuses
- Monitor payments
- Access a dedicated admin dashboard

---

# ✨ Features

## 👤 Customer Features

- 🔐 User Registration & Login
- 🚗 Browse Available Vehicles
- 🔎 View Vehicle Details
- 📅 Create Vehicle Bookings
- 📋 View My Bookings
- ❌ Cancel Eligible Bookings
- 💳 Online Payment with Razorpay
- 💰 View Payment History
- ⭐ Submit Vehicle Reviews
- ⭐ View Vehicle Reviews
- 🔔 Toast Notifications
- 🚫 Custom 404 Not Found Page

---

## 🛠️ Admin Features

- 📊 Admin Dashboard
- 👥 View System Statistics
- 🚗 Add Vehicles
- ✏️ Edit Vehicles
- 🗑️ Delete Vehicles
- 🔄 Update Vehicle Status
- 📋 View All Customer Bookings
- 🔄 Update Booking Status
- 💳 View All Payments
- 🔐 Admin-only Protected Routes

---

# 🔄 Customer Application Flow

```text
                    ┌──────────────────┐
                    │     Customer     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Register / Login │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Browse Vehicles  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Vehicle Details  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Create Booking   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Razorpay Payment │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Admin Confirms   │
                    │     Booking      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Rental Completed │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Admin Marks      │
                    │ Booking Complete │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Submit Review   │
                    └──────────────────┘
```
---

# 📂 Project Structure
```text
Vehicle-Rental-System/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   └── vehicleController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── vehicleRoutes.js
│   │
│   ├── models/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── .env
│   ├── server.js
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── layouts/
│   │   │   ├── customerLayout.jsx
│   │   │   └── adminLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── home.jsx
│   │   │   ├── vehicles.jsx
│   │   │   ├── vehicleDetails.jsx
│   │   │   ├── booking.jsx
│   │   │   ├── myBookings.jsx
│   │   │   ├── myPayments.jsx
│   │   │   ├── reviews.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── manageVehicles.jsx
│   │   │   ├── manageBookings.jsx
│   │   │   ├── managePayments.jsx
│   │   │   ├── payment.jsx
│   │   │   └── notFound.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .gitignore
│   │
│   └── package.json
│
└── README.md
