# Parampreet Singh Portfolio

Premium personal portfolio with a separate admin dashboard and Express/JSON-file database backend.

## 🚀 Out-of-the-Box Database Setup

This project uses a custom, lightweight file-based JSON database wrapper (`backend/db.js`) that reads and writes to local files in `backend/data/`. 

> [!NOTE]
> **No local MongoDB installation or setup is required** to run this project in development mode. It works immediately out-of-the-box!

---

## 1. Backend

```bash
cd backend
npm install
# Create/verify .env file is present (default configuration is pre-configured)
npm run dev
```

Runs on `http://localhost:5001`.

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## 3. Admin Panel

```bash
cd admin
npm install
npm run dev
```

Runs on `http://localhost:5174`.

---

## 🔑 Admin Access & Authentication

The project comes pre-seeded with a default administrator account.

- **Admin Control Panel URL**: `http://localhost:5174/login`
- **Default Secure Access Key**: `8890016089`

Once logged in, you can update admin settings, such as username, profile picture, theme accent color, or set a new custom password directly in the **Settings** view of the Admin Dashboard. This will automatically hash your new password via `bcrypt` and store it securely in the database (`backend/data/admins.json`).

---

## 4. Bootstrapping Additional Admin Accounts (Optional)

If you need to bootstrap a new admin user programmatically:

```http
POST http://localhost:5001/api/auth/bootstrap
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}
```

*Note: The `/api/auth/bootstrap` route only succeeds if no admin accounts currently exist in the database.*

---

## 5. Environment Variables

Backend `.env` (pre-created or configured in `backend/`):

```env
MONGO_URI=mongodb://localhost:27017/portfolio  # Ignored when running local JSON db
JWT_SECRET=your_super_secret_key_here
PORT=5001
```

Frontend and admin `.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

## Production Notes

- Replace `JWT_SECRET` with a long random value.
- Restrict CORS origins to deployed frontend/admin domains.
- Store uploads on durable object storage for hosted deployments.