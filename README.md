# 🩺 Healthcare Appointment Backend

Production-grade backend powering a telemedicine platform, built for:

* 100,000+ daily consultations
* 99.95% availability
* p95 < 200ms read latency
* Scalable, secure, modular architecture

---

## 🎯 Project Overview

Production-ready backend built using NestJS, PostgreSQL, Redis, and Docker, designed with scalability, reliability, and observability in mind.

---

## 🧱 Core Technologies

| Layer              | Technology              | Rationale                                                      |
| ------------------ | ----------------------- | -------------------------------------------------------------- |
| **Backend**        | Node.js (NestJS)        | Modular services with DI, compliant with language guidelines   |
| **Database**       | PostgreSQL              | Primary transactional DB, meeting required DB selection        |
| **Caching**        | Redis                   | High-speed caching to achieve latency goals                    |
| **Infrastructure** | Docker / Docker Compose | Containerization & Infra-as-Code for CI/CD deployment          |
| **Security**       | JWT, bcrypt, RBAC       | Token-based access control with role-based authorization       |

---

## 🚀 Getting Started

### Prerequisites

* Docker (required for Postgres & Redis)
* Node.js / npm (required to run the NestJS backend)

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-ssh-or-https-url>
cd Healthcare_Appointment_Backend
```

---

### 2️⃣ Create Environment Variables File

Create a `.env` file in the project root (secrets via env vars):

```ini
# .env
POSTGRES_USER=amrutamuser
POSTGRES_PASSWORD=securepassword
POSTGRES_DB=amrutam_db
POSTGRES_PORT=5432

REDIS_HOST=redis
REDIS_PORT=6379

# JWT secret for signing tokens
JWT_SECRET=YOUR_SUPER_SECURE_TOKEN_FOR_SIGNING_JWTS
```

---

### 3️⃣ Launch Infrastructure (Postgres + Redis)

```bash
docker-compose up -d
```

---

### 4️⃣ Install Dependencies & Start Backend

```bash
npm install
npm run start:dev
```

Your application will start at:

👉 **[http://localhost:3000](http://localhost:3000)**

---

## ⚙️ Core Architecture & Modules

The backend follows a modular service architecture with separate domain-driven modules.

---

## 🔐 Authentication Module

| Workflow       | Method | Endpoint           | Feature                                          |
| -------------- | ------ | ------------------ | ------------------------------------------------ |
| Registration   | POST   | `/auth/register`   | bcrypt password hashing, input validation        |
| Login          | POST   | `/auth/login`      | JWT-based authentication (user lifecycle)        |
| Role Update    | POST   | `/auth/admin/role` | Access controlled via `@Roles(ADMIN)` (RBAC)     |

---

## 📅 Booking Module

| Workflow              | Method | Endpoint                | Feature                                                  |
| --------------------- | ------ | ----------------------- | -------------------------------------------------------- |
| Availability Search   | GET    | `/booking/slots/search` | Redis cache to meet p95 < 200ms latency                  |
| Transactional Booking | POST   | `/booking/slots/book`   | Pessimistic locking (concurrency) and transaction mgmt   |

---

## 🩺 Consultation Module

| Workflow            | Method | Endpoint                         | Feature                                                    |
| ------------------- | ------ | -------------------------------- | ---------------------------------------------------------- |
| Upload Prescription | POST   | `/consultation/:id/prescription` | Triggers asynchronous audit logging (compliance & async jobs) |