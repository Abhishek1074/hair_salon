# Studio Nora — Full-Stack Salon Booking App

A working starter application with:
- React + Vite + TypeScript + Tailwind frontend
- Express + TypeScript backend
- MongoDB + Mongoose
- JWT authentication with customer/admin roles
- Service and stylist APIs
- Appointment creation with overlap protection
- Admin dashboard API and basic admin UI

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas connection string

## 1. Configure backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Edit `backend/.env` and set:
- `MONGODB_URI`
- `JWT_SECRET` (use a long random secret)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Backend runs at `http://localhost:5000`.

## 2. Configure frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Demo admin
The seed script creates the admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`.
Do not use the demo credentials in production.

## Notes
- Appointment availability is validated on the server at booking time.
- This starter prevents overlapping appointments for the same stylist.
- For production, add email/SMS notifications, payment integration, audit logs,
  stronger rate limits, automated tests, and a transactional booking strategy
  (MongoDB replica set transactions or a dedicated slot-locking collection).
- Replace sample salon address, phone, photos, prices, and policies with real details.
