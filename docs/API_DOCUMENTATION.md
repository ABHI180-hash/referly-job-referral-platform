# Referly — RESTful API Documentation

This document specifies the RESTful API endpoints, request contracts, authentication flows, and response payloads for the Referly platform.

---

## 1. Overview & Base URL

- **Development Base URL:** `http://localhost:5000/api`
- **Interactive Swagger Explorer:** `http://localhost:5000/api-docs`
- **Default Data Format:** JSON (`Content-Type: application/json`)
- **Character Encoding:** UTF-8

---

## 2. Authentication & Authorization

All protected endpoints require an HTTP `Authorization` header containing an active JSON Web Token (JWT) formatted as:

```http
Authorization: Bearer <your_jwt_access_token>
```

Tokens are verified against user roles (`seeker`, `referrer`, `admin`). Requests lacking valid tokens or sufficient privileges receive standard `401 Unauthorized` or `403 Forbidden` responses.

---

## 3. Authentication Endpoints (`/api/auth`)

### 3.1 Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Sarah Mitchell",
  "email": "sarah.mitchell@figma.com",
  "password": "Password123!",
  "role": "referrer",
  "company": "Figma",
  "title": "Senior Product Designer"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "usr_671a9e",
      "name": "Sarah Mitchell",
      "email": "sarah.mitchell@figma.com",
      "role": "referrer",
      "company": "Figma"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

### 3.2 Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "priya.sharma@example.com",
  "password": "Password123!"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_101",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "role": "seeker"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

### 3.3 Refresh Session Token
- **Method:** `POST`
- **Endpoint:** `/api/auth/refresh`
- **Request Body:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```

---

## 4. Job Requisitions Endpoints (`/api/jobs`)

### 4.1 List & Filter Jobs
- **Method:** `GET`
- **Endpoint:** `/api/jobs`
- **Access:** Public
- **Query Parameters:**
  - `search` *(string)*: Substring match on title, company, or description.
  - `role` *(string)*: Engineering category (`Frontend`, `Backend`, `Fullstack`, `DevOps`, `Design`, `Product`).
  - `location` *(string)*: City or region filter.
  - `type` *(string)*: `Remote`, `Hybrid`, `Onsite`, or `Full-time`.
  - `experience` *(string)*: `Entry-level`, `Mid-level`, `Senior`, `Lead`.
  - `page` *(number)*: Page index (default: `1`).
  - `limit` *(number)*: Items per page (default: `10`).

- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 26,
  "data": [
    {
      "id": "job_001",
      "title": "Senior Frontend Engineer (Design Systems)",
      "company": "Stripe",
      "companyLogo": "/logos/stripe.svg",
      "location": "Bengaluru, India (Hybrid)",
      "type": "Full-time",
      "experience": "4 - 7 years",
      "salary": "₹38L - ₹55L + Equity",
      "activeSponsorsCount": 14,
      "skills": ["React", "TypeScript", "Tailwind CSS", "Figma", "Design Tokens"],
      "postedDate": "2026-11-01T08:00:00.000Z"
    }
  ]
}
```

### 4.2 Get Job by ID
- **Method:** `GET`
- **Endpoint:** `/api/jobs/:id`
- **Access:** Public

### 4.3 Create Job Requisition
- **Method:** `POST`
- **Endpoint:** `/api/jobs`
- **Access:** Authenticated (`admin`, `referrer`)

---

## 5. Referral Management Endpoints (`/api/referrals`)

### 5.1 Request an Employee Referral
- **Method:** `POST`
- **Endpoint:** `/api/referrals`
- **Access:** Authenticated (`seeker`)
- **Request Body:**
```json
{
  "jobId": "job_001",
  "referrerId": "ref_002",
  "note": "Hi Sarah, I noticed your team is expanding Stripe's design systems team. My background includes building enterprise component libraries with React 19.",
  "resumeUrl": "https://res.cloudinary.com/demo/resumes/priya_sharma_resume.pdf",
  "portfolioUrl": "https://priyasharma.design"
}
```

### 5.2 Update Referral Status (Accept/Decline)
- **Method:** `PATCH`
- **Endpoint:** `/api/referrals/:id/status`
- **Access:** Authenticated (`referrer`, `admin`)
- **Request Body:**
```json
{
  "status": "accepted",
  "feedback": "Strong portfolio. Submitted into Stripe's internal referral portal under requisition REQ-4491."
}
```

---

## 6. Messaging & Chat Endpoints (`/api/messages`)

### 6.1 List Active Conversations
- **Method:** `GET`
- **Endpoint:** `/api/messages/conversations`
- **Access:** Authenticated

### 6.2 Get Conversation Messages
- **Method:** `GET`
- **Endpoint:** `/api/messages/:conversationId`
- **Access:** Authenticated

### 6.3 Send Message with Attachments
- **Method:** `POST`
- **Endpoint:** `/api/messages/:conversationId`
- **Access:** Authenticated
- **Request Body:**
```json
{
  "content": "Hi! Here is my updated design systems portfolio deck.",
  "attachments": [
    {
      "id": "att_91",
      "name": "Design_Systems_Case_Study.pdf",
      "type": "application/pdf",
      "size": 2450000,
      "url": "/uploads/documents/Design_Systems_Case_Study.pdf"
    }
  ]
}
```

---

## 7. Standardized Error Payloads

All error responses return structured JSON with uniform keys:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested job requisition was not found.",
    "statusCode": 404
  }
}
```

| HTTP Status | Typical Cause |
| :--- | :--- |
| **`400 Bad Request`** | Validation failure or missing required body parameters. |
| **`401 Unauthorized`** | Missing or expired JWT access token. |
| **`403 Forbidden`** | Insufficient role clearance for the target resource. |
| **`404 Not Found`** | Targeted resource identifier does not exist. |
| **`429 Too Many Requests`** | API rate limit exceeded (100 req/15min). |
| **`500 Internal Error`** | Unhandled server exception. |
