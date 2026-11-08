# Referly — Local Installation & Setup Guide

This guide provides end-to-end instructions for cloning, configuring, and running the Referly platform locally on macOS, Linux, and Windows.

---

## 1. System Prerequisites

Ensure the following runtimes are installed on your workstation:

| Requirement | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.x` or `v22.x` LTS | `node -v` |
| **npm** | `v9.0.0` | `v10.x+` | `npm -v` |
| **Git** | `v2.30.0` | Latest | `git --version` |
| **MongoDB** | Optional | `v6.0+` or Atlas | `mongod --version` *(Referly includes auto in-memory fallback)* |

> [!NOTE]
> An external MongoDB installation is **not mandatory** for local development. If `MONGODB_URI` is omitted or uncontactable, the server automatically boots an in-memory database with pre-seeded jobs, companies, and user profiles.

---

## 2. Clone the Repository

Clone the repository and enter the project root directory:

```bash
git clone https://github.com/ABHI180-hash/referly-job-referral-platform.git
cd referly-job-referral-platform
```

---

## 3. Install Dependencies

Install all root, server, and client dependencies. You can install all layers concurrently from the root:

```bash
# Install root orchestration dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Return to repository root
cd ..
```

---

## 4. Configure Environment Variables

Create your local `.env` file by copying the provided `.env.example`:

```bash
# On Linux / macOS / Git Bash:
cp .env.example server/.env

# On Windows PowerShell:
Copy-Item .env.example server/.env
```

### Environment Configuration Reference

Edit `server/.env` with your parameters:

```env
# Server Network Settings
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection (Leave empty or default for In-Memory evaluation)
MONGODB_URI=mongodb://localhost:27017/referly

# Authentication Secrets (Replace with high-entropy keys for production)
JWT_ACCESS_SECRET=referly_super_secure_access_token_dev_key_2026
JWT_REFRESH_SECRET=referly_super_secure_refresh_token_dev_key_2026
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Optional Cloudinary (File & Resume Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional Email Dispatch (Mailtrap / SendGrid)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=notifications@referly.careers
```

---

## 5. Starting the Development Environment

You can start both the client and server concurrently from the root directory:

```bash
npm run dev
```

Alternatively, run each service in dedicated terminal windows:

### Terminal 1 — Start the Backend Server:
```bash
cd server
npm run dev
```
*The backend boots on `http://localhost:5000`. If MongoDB is running locally, it connects immediately; otherwise, it mounts the internal memory cluster in ~2 seconds.*

### Terminal 2 — Start the Frontend Client:
```bash
cd client
npm run dev
```
*The Vite development server boots on `http://localhost:5173`.*

---

## 6. Accessing the Platform & Demo Accounts

Open your browser and navigate to:
👉 **`http://localhost:5173`**

### Pre-Configured Demo Accounts

Referly includes instant role-switching and pre-seeded test personas:

| Role | Name | Email | Initial View |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | Priya Sharma | `priya.sharma@example.com` | Seeker Dashboard (`/dashboard`) |
| **Referrer** | Sarah Mitchell | `sarah.mitchell@figma.com` | Referrer Dashboard (`/referrer-dashboard`) |
| **Admin** | Vikramaditya | `admin@referly.careers` | Admin Mission Control (`/admin`) |

*Tip: You can switch between roles seamlessly using the role selector in the navbar.*

---

## 7. Interactive API Documentation

When the backend is active, explore and test the complete OpenAPI / Swagger documentation at:
👉 **`http://localhost:5000/api-docs`**

---

## 8. Running Builds & Test Suites

### Execute Backend Test Suite:
```bash
cd server
npm test
```
*Runs the 18-suite Jest test suite verifying auth, rate limiting, and route security.*

### Verify Frontend Production Build:
```bash
cd client
npm run build
```
*Performs TypeScript AST checks (`tsc -b`) and bundles optimized static assets into `client/dist/`.*

---

## 9. Troubleshooting & FAQ

### Issue: PowerShell execution policy blocks `npm` scripts
**Fix:** On Windows PowerShell, execute commands using `npm.cmd` instead of `npm`, or adjust execution policy:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Issue: Port 5000 or 5173 already occupied
**Fix:** Terminate existing processes or adjust `PORT` in `server/.env` and `client/vite.config.ts`.
```bash
# On Windows PowerShell:
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
```

### Issue: Database connection timeout
**Fix:** If you do not have a local MongoDB daemon installed, simply comment out or delete the `MONGODB_URI` line in `server/.env`. Referly will automatically spin up its in-memory database server.
