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

👉 **[http://localhost:3000](http://localhost:8080)**

---

## ⚙️ Core Architecture & Modules

The backend follows a modular service architecture with separate domain-driven modules.

---

## 🔐 Authentication Module

| Workflow       | Method | Endpoint           | Feature                                          |
| -------------- | ------ | ------------------ | ------------------------------------------------ |
| Registration   | POST   | `/auth/register`   | bcrypt password hashing, input validation        |
| Login          | POST   | `/auth/login`      | JWT-based authentication (user lifecycle)        |

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

## 📝 API Documentation (OpenAPI 3.0)

This project includes a complete, production-ready **OpenAPI 3.0 specification**  
located at: **openapi.yaml**

---

### 📘 View the API Documentation

You can preview the API spec locally using Swagger UI:

```bash
npx @redocly/cli preview-docs openapi.yaml

---

## 🚦 CI/CD Pipeline (GitHub Actions)

This repository includes a full CI/CD pipeline located at:
***.github/workflows/ci-pipeline.yml***

The pipeline includes:

✔ Automated dependency installation  
✔ PostgreSQL test container  
✔ Unit & integration test execution  
✔ Linting & type-checking  
✔ Docker image build (`docker build`)  
✔ Optional push to container registry  
✔ Deployment simulation step (Terraform)

This ensures continuous integration and production-grade build validation.

---

## 📊 Observability & Monitoring

This system implements production-grade observability:

### 🔹 Logging
- Structured JSON logs  
- HTTP request/response logging (global interceptor)

### 🔹 Metrics
- Prometheus-style metrics endpoint (`/metrics`)  
- Track request latency, DB latency, cache hit rate

### 🔹 Tracing
- Distributed tracing (OpenTelemetry-ready)  
- Span context propagation across requests

The detailed Observability Strategy document is included in:

___

### Documentations:
- **Architecture Document: https://docs.google.com/document/d/1X2qc1ZmN8t3kgjNLg8XKf9QUC0DOx8FhhEstJrWKL0s/edit?tab=t.0**