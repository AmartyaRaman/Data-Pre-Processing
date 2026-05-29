# ⚡ Express Gateway Backend

This is the gateway backend service for the Data Pre-Processor project. It is built using **Node.js**, **Express.js**, **TypeScript**, and **Drizzle ORM** (connecting to a **Neon PostgreSQL** database). 

It manages user registrations, login sessions (using JWT), file validation, and acts as a proxy to the Python `data-service` microservice for data processing.

## 🚀 Quick Start

### 1. Installation
Run the following command to install dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in this directory based on the `.env.example`:
```bash
DATABASE_URL=your_neon_postgresql_db_connection_string
JWT_SECRET=your_secret_key_for_signing_jwts
```

### 3. Database Schema Push (Drizzle ORM)
Push the TypeScript models to your PostgreSQL database:
```bash
npx drizzle-kit push
```

### 4. Running the Development Server
```bash
npm run dev
```
The server will start on http://localhost:5000.

## 🔑 Endpoints

### Auth Routes (`/api/auth`)
- `POST /register`: Registers a new user. Required fields: `name`, `email`, `password`.
- `POST /login`: Authenticates user credentials and sends a JWT token.
- `POST /logout`: Destroys the cookie session.

### User Routes (`/api/users`)
- Manage authenticated user profiles.

### File Routes (`/api/file`)
- `POST /upload` (JWT Authenticated): Validates and uploads a CSV file.
- `POST /process` (JWT Authenticated): Uploads a CSV file, forwards it to the Python data microservice, and returns the preprocessed data and analysis report.

---

For full details on the system architecture, FastAPI microservice, and end-to-end integration, please refer to the **[Root Project README](../README.md)**.
