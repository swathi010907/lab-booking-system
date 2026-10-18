# Electronics Lab Booking System

A full stack web application to book electronics lab slots online. Students can browse labs, book date and time slots, and track booking status. Lab admins can manage labs and approve or reject bookings.

Built for the **Tamizhan Skills RISE Internship** (Full Stack Development, MERN) - Project 6: Online Appointment Booking System.

## Live Demo

- Frontend: https://lab-booking-system-theta.vercel.app
- Backend API: https://lab-booking-system-khe5.onrender.com

Note: The backend runs on a free plan and sleeps when idle, so the first request may take 30-50 seconds.

## Features

- User registration and login with JWT authentication
- Two roles: student and admin
- Lab listing with availability on/off
- Booking with date and time slots
- Conflict handling: overlapping bookings for the same lab and date are rejected
- Booking status: pending, approved, rejected, cancelled
- Students can view booking history and cancel bookings
- Admin dashboard: add, enable/disable, delete labs; approve or reject bookings
- Input validation and error handling on frontend and backend

## Tech Stack

- Frontend: React (Vite), React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Auth: JWT, bcryptjs
- Deployment: Vercel (frontend), Render (backend)

## Project Structure

```
Electronics- Lab- Booking/
  client/              React frontend
    src/
      pages/           Login, Register, Labs, Book, MyBookings, Admin
      api.js           Axios setup
  server/              Express backend
    models/            User, Lab, Booking
    routes/            auth, labs, bookings
    middleware/        JWT auth and admin check
    server.js
```

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register a student |
| POST | /api/auth/login | Public | Login and get token |
| GET | /api/labs | Logged in | List all labs |
| POST | /api/labs | Admin | Add a lab |
| PUT | /api/labs/:id | Admin | Update lab or availability |
| DELETE | /api/labs/:id | Admin | Delete a lab |
| POST | /api/bookings | Logged in | Create a booking (with conflict check) |
| GET | /api/bookings/my | Logged in | My booking history |
| GET | /api/bookings | Admin | All bookings |
| PUT | /api/bookings/:id/status | Admin | Approve or reject |
| PUT | /api/bookings/:id/cancel | Owner | Cancel own booking |

## Run Locally

Prerequisites: Node.js, Git, a MongoDB Atlas database.

1. Clone the repo

```
git clone https://github.com/swathi010907/lab-booking-system.git
cd lab-booking-system
```

2. Backend

```
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

```
npm run dev
```

3. Frontend (new terminal)

```
cd client
npm install
npm run dev
```

Open http://localhost:5173. To point the frontend to a deployed backend, set `VITE_API_URL` (for example `https://your-backend.onrender.com/api`).

## Admin Account

New registrations are students by default. To make an admin, change the user's `role` to `admin` in the `users` collection in MongoDB Atlas.

## Author

Swathi