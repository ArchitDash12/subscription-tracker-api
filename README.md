# 🚀 SubTrack — Production-Ready Subscription Management API

<div align="center">

  ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
  ![Upstash](https://img.shields.io/badge/Upstash%20QStash-00E599?style=for-the-badge&logo=upstash&logoColor=white)
  ![Arcjet](https://img.shields.io/badge/Arcjet%20Security-FF5A5F?style=for-the-badge&logo=shield&logoColor=white)
  ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

  <br />

  <p align="center">
    A robust, highly secure, and automated subscription tracking REST API with database transactions, automated email reminder workflows, rate limiting, and bot protection.
  </p>

  **[🌐 View Live API Deployment](https://subscription-tracker-api-jwqk.onrender.com/)** &bull; **[📖 Jump to API Endpoints](#-api-endpoints--usage)**

</div>

---

## 📌 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Badges](#️-tech-stack--architecture)
- [🧠 Engineering Challenges & How I Overcame Them](#-engineering-challenges--how-i-overcame-them)
- [🏗️ Architectural Highlights](#️-architectural-highlights)
- [🚀 Quick Start (Local Setup)](#-quick-start-local-setup)
- [📡 API Endpoints & Usage](#-api-endpoints--usage)
- [🛡️ Security & Protection Layer](#️-security--protection-layer)

---

## ✨ Key Features

- **🔐 Robust Auth with Atomic Transactions**: User registration is safeguarded using MongoDB ACID sessions (`mongoose.startSession()`). If token signing or database creation fails, changes roll back immediately.
- **📅 Dynamic Subscription Lifecycle & Auto-Renewals**: Smart pre-save calculations determine renewal periods (daily, weekly, monthly, yearly) and automatically update expired status based on date milestones.
- **⏰ Automated Background Workflows (QStash & Upstash)**: Serverless step-function background workflows that sleep until 7, 5, 3, and 2 days before renewal, triggering automated branded reminder emails via Nodemailer.
- **🛡️ Enterprise Security with Arcjet**: Built-in Shield protection, intelligent bot detection (allowing verified search engine crawlers while blocking malicious scrapers), and token bucket rate limiting (10-capacity, 5-token refill).
- **🔒 Granular JWT Authorization**: Protected routes inspect Bearer tokens, prevent ID spoofing, and guarantee that users can only inspect and manage their own subscriptions.
- **⚡ Centralized Global Error Handling**: Unified catch-all error handling middleware that captures Mongoose `CastError`, duplicate key `11000`, and validation errors, translating them into client-friendly error structures.

---

## 🛠️ Tech Stack & Architecture

### Backend & Runtime
| Technology | Description | Badge |
| :--- | :--- | :--- |
| **Node.js** | Next-generation JavaScript runtime (v24 LTS, native ES Modules) | <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" /> |
| **Express.js** | Lightweight, scalable HTTP server framework | <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" /> |
| **MongoDB Atlas** | Distributed cloud NoSQL database cluster | <img src="https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" /> |
| **Mongoose v9** | Advanced ODM with schema validations & lifecycle hooks | <img src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white" /> |

### Security & Authentication
| Technology | Description | Badge |
| :--- | :--- | :--- |
| **JWT (JsonWebToken)** | Stateless session authentication with expiration timestamps | <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" /> |
| **Bcrypt.js** | Salted hashing algorithm for user passwords | <img src="https://img.shields.io/badge/Bcrypt.js-4A90E2?style=flat-square&logo=key&logoColor=white" /> |
| **Arcjet** | Modern application defense: rate limiting, bot protection, shield | <img src="https://img.shields.io/badge/Arcjet-FF5A5F?style=flat-square&logo=security&logoColor=white" /> |

### Workflows, Scheduling & Mailing
| Technology | Description | Badge |
| :--- | :--- | :--- |
| **Upstash QStash** | Serverless durable workflow engine for scheduled task execution | <img src="https://img.shields.io/badge/Upstash%20QStash-00E599?style=flat-square&logo=upstash&logoColor=black" /> |
| **Nodemailer** | SMTP mailer service sending styled HTML transactional emails | <img src="https://img.shields.io/badge/Nodemailer-007ACC?style=flat-square&logo=gmail&logoColor=white" /> |
| **Day.js** | Fast 2kB alternative to Moment.js for date arithmetic | <img src="https://img.shields.io/badge/Day.js-FF5F56?style=flat-square&logo=calendar&logoColor=white" /> |

### Infrastructure & Deployment
| Technology | Description | Badge |
| :--- | :--- | :--- |
| **Render Cloud** | Containerized cloud host with automatic deployments | <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" /> |
| **Git / GitHub** | Version control & automated CI/CD triggers | <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" /> |

---

## 🧠 Engineering Challenges & How I Overcame Them

Building a production-grade API involves solving real-world distributed systems, runtime, and deployment hurdles. Here is how each obstacle was conquered:

### 1. Migrating to Native ES Modules (`ERR_MODULE_NOT_FOUND`)
- **The Challenge**: The project migrated to Node.js ES Modules (`"type": "module"`). Express crashed with `ERR_MODULE_NOT_FOUND: Cannot find module controllers/auth.controller`.
- **Root Cause**: Unlike CommonJS (`require()`), ESM strictly requires complete relative paths including the `.js` file extension for all local imports.
- **The Solution**: Audited all routes and controllers, systematically specifying `.js` suffixes across `auth.routes.js`, `auth.controller.js`, `env.js`, and models.

### 2. Mongoose v9 Lifecycle Pre-Save Hook Breaking Change
- **The Challenge**: During subscription creation, testing with HTTPie returned `TypeError: next is not a function`.
- **Root Cause**: Older Mongoose docs relied on callback-style middleware (`subscriptionSchema.pre('save', function(next) { ... next(); })`). Mongoose v8/v9 removed `next` callbacks in favor of modern synchronous and Promise/async middleware.
- **The Solution**: Refactored the pre-save hook into a synchronous function without the `next` argument:
  ```javascript
  subscriptionSchema.pre('save', function () {
      if(!this.renewalDate) {
          const renewalPeriods = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
          this.renewalDate = new Date(this.startDate);
          this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
      }
      if(this.renewalDate < new Date()) {
          this.status = 'expired';
      }
  });
  ```

### 3. MongoDB Atlas Handshake & SSL Alert 80
- **The Challenge**: The API server threw `MongoNetworkError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error (SSL alert number 80)`.
- **Root Cause**: MongoDB Atlas aggressively terminates TLS handshakes when the connecting IP is blocked by the cluster firewall. Additionally, development connection strings lacked database targets.
- **The Solution**:
  - Configured IP Access list in Atlas to allow traffic (`0.0.0.0/0` for cloud deployment).
  - Explicitly qualified the database name directly in the URI query params (`...mongodb.net/subtrack?retryWrites=true&w=majority`).

### 4. Render Deployment `502 Bad Gateway` & Dynamic Port Binding
- **The Challenge**: Deployed to Render, but requests returned `502 Bad Gateway` despite working perfectly on `localhost`.
- **Root Cause**:
  1. `.env.*.local` files were properly ignored by Git for security, leaving the production container without environment variables.
  2. Render assigns a dynamic port via `process.env.PORT` (e.g. `10000`). If the code defaulted strictly to `5500`, the Render reverse proxy could never communicate with the app.
- **The Solution**:
  - Hardened [config/env.js](file:///c:/Backend%20Learning/subscription-tracker/config/env.js) to read `export const PORT = process.env.PORT || 5500;`.
  - Configured environment variables directly inside the Render Dashboard (securing credentials without committing secrets).
  - Configured fallback defaults in `config/env.js` so missing `.env` files in production don't crash startup.

### 5. Durable Long-Term Scheduling Without Memory Leaks
- **The Challenge**: Running subscription reminders weeks or months in advance using traditional `setInterval` or cron jobs causes memory bloat, lost reminders on server restarts, and concurrency bottlenecks.
- **The Solution**: Integrated **Upstash QStash Workflows**. When a subscription is saved, an asynchronous durable workflow is scheduled via REST. The workflow steps sleep until designated countdown days (7, 5, 3, 2 days before renewal) and wake up to dispatch responsive HTML emails via Nodemailer, surviving server restarts and cold boots without consuming CPU/memory.

---

## 🏗️ Architectural Highlights

```
subscription-tracker/
├── 📁 config/              # Arcjet, Dotenv, Nodemailer, Upstash clients
├── 📁 controllers/         # Core business logic (auth, subscription, user, workflow)
├── 📁 database/            # MongoDB Atlas connection lifecycle & error management
├── 📁 middleware/          # JWT authorization, Arcjet shield/rate-limit, Central error handler
├── 📁 models/              # Mongoose schemas with validation & pre-save hooks
├── 📁 routes/              # Modular Express routers (/api/v1/...)
├── 📁 utils/               # Responsive HTML email templates & mail delivery handlers
├── 📄 app.js               # Express application composition & server entry point
└── 📄 package.json         # ES module configuration, dependencies & scripts
```

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/subscription-tracker.git
cd subscription-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.development.local` file in the root folder:
```env
PORT=5500
NODE_ENV=development

# Database
DB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/subtrack?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d

# Arcjet Security
ARCJET_KEY=your_arcjet_api_key
ARCJET_ENV=development

# Upstash QStash
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_upstash_token

# Email & App URL
SERVER_URL=http://localhost:5500
EMAIL_PASSWORD=your_gmail_app_password
```

### 4. Run the development server
```bash
npm run dev
```
The server will boot up at `http://localhost:5500`.

---

## 📡 API Endpoints & Usage

### Base URL
```text
https://subscription-tracker-api-jwqk.onrender.com
```

### 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/sign-up` | Register a new user & receive JWT token | No |
| `POST` | `/api/v1/auth/sign-in` | Authenticate user & receive JWT token | No |
| `POST` | `/api/v1/auth/sign-out` | Log out / invalidate session | No |

#### Example: Register User
```bash
# Using HTTPie
http POST https://subscription-tracker-api-jwqk.onrender.com/api/v1/auth/sign-up \
  name="Alex Developer" \
  email="alex@example.com" \
  password="StrongPassword123!"
```

---

### 2. Subscriptions (`/api/v1/subscriptions`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/subscriptions` | Create subscription & trigger reminder workflow | **Yes (Bearer)** |
| `GET` | `/api/v1/subscriptions/user/:id` | Fetch all subscriptions for a specific user | **Yes (Bearer)** |
| `GET` | `/api/v1/subscriptions` | List subscriptions (administrative) | No |
| `GET` | `/api/v1/subscriptions/:id` | Get details of a single subscription | No |
| `PUT` | `/api/v1/subscriptions/:id` | Update subscription details | No |
| `DELETE`| `/api/v1/subscriptions/:id` | Cancel/delete subscription | No |

#### Example: Create a Subscription
```bash
http POST https://subscription-tracker-api-jwqk.onrender.com/api/v1/subscriptions \
  "Authorization:Bearer <YOUR_JWT_TOKEN>" \
  name="Spotify Premium" \
  price:=10.99 \
  currency="USD" \
  frequency="monthly" \
  category="entertainment" \
  paymentMethod="Credit Card" \
  startDate="2025-01-01"
```

---

### 3. Users (`/api/v1/users`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | Retrieve list of all users | No |
| `GET` | `/api/v1/users/:id` | Retrieve single user profile by ID | **Yes (Bearer)** |

---

## 🛡️ Security & Protection Layer

- **Arcjet Bot Detection**: Configured in live mode to allow legitimate web indexers (`CATEGORY:SEARCH_ENGINE`) while blocking scrapers, credential stuffers, and automated bots.
- **Arcjet Token Bucket Rate Limiting**: Enforces max burst capacities of 10 requests with 5 tokens refilled every 10 seconds per IP, returning `429 Too Many Requests` when limits are exceeded.
- **Bcrypt Password Salt Hashing**: Plaintext passwords never touch the database; they are hashed with 10 salt rounds before storage.
- **Scoped User Verification**: Prevents Insecure Direct Object References (IDOR) by confirming `req.user.id === req.params.id` before returning private account subscriptions.

---

## 👨‍💻 Author

Crafted with dedication by **Archit Dash**  
*Building resilient, automated, production-grade cloud architectures.*
