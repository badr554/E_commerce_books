# Marginalia (kOTOB ONLINE) - Secure E-Bookstore System

Marginalia is a secure, full-stack E-Bookstore web application designed to provide users with a seamless browsing, shopping, and checkout experience. The system is architected with strict adherence to modern cybersecurity standards, implementing defense mechanisms against common web vulnerabilities.

---

#  Tech Stack

## Frontend

* **React.js**
  Dynamic and responsive user interface designed for a smooth user experience.

* **Vite**
  Frontend build tool providing fast bundling and hot module replacement.

* **Tailwind CSS**
  Modern utility-first CSS framework for responsive and clean UI components.

---

## Backend & Database

* **Laravel (PHP)**
  Robust MVC framework powering the secure REST API backend.

* **Laravel Sanctum**
  Lightweight token-based authentication system securing API communication.

* **MySQL**
  Relational database management system used for persistent secure storage.

---

## Third-Party Integrations

* **Stripe API**
  Secure online payment infrastructure handling checkout and billing operations.

* **Google OAuth 2.0 (Laravel Socialite)**
  Secure passwordless authentication using Google accounts.

---

# 🛡️ Security Implementations & Mitigations

The system was audited and hardened against critical web vulnerabilities using industry-standard security practices.

---

## 1. SQL Injection (SQLi) Defense

### Mechanism

Strict use of **Laravel Eloquent ORM** and **PDO Parameter Binding**.

### Implementation

User input is never directly concatenated into SQL queries. Instead, parameterized ORM queries are used:

```php
User::where('email', $email)->first();
```

This prevents classic SQL injection payloads such as:

```sql
' OR '1'='1
```

from altering query logic.

---

## 2. Cross-Site Scripting (XSS) Mitigation

### Mechanism

Input sanitization and HTML character escaping.

### Implementation

User-controlled input fields are sanitized using:

```php
htmlspecialchars()
strip_tags()
```

This prevents attackers from injecting malicious JavaScript into:

* User profiles
* Shipping addresses
* Checkout forms
* Review/comment systems

---

## 3. Insecure Direct Object Reference (IDOR) Protection

### Mechanism

Authenticated ownership validation using token-scoped queries.

### Implementation

Sensitive resources are never accessed using untrusted frontend parameters like:

```text
user_id
```

Instead, ownership is derived securely using:

```php
auth('sanctum')->user()
```

Example:

* Cart items are updated only if they belong to the authenticated token holder.
* Orders can only be viewed by their legitimate owner.

---

## 4. Stripe Webhook Cryptographic Verification

### Mechanism

Stripe webhook signature validation.

### Implementation

Incoming webhook requests validate the:

```text
Stripe-Signature
```

header using the securely stored:

```text
STRIPE_WEBHOOK_SECRET
```

before marking an order as paid.

This protects against:

* Forged payment confirmations
* Billing bypass attempts
* Fake checkout completion attacks

---

# ⚙️ Installation & Setup

# Prerequisites

Ensure the following are installed:

* PHP >= 8.2
* Composer
* Node.js & NPM
* MySQL Server
* XAMPP / Laragon (optional local stack)

---

# Backend Setup (Laravel)

## 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

---

## 2. Install Dependencies

```bash
composer install
```

---

## 3. Configure Environment

Copy the environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

---

## 4. Configure Database

Inside `.env`:

```env
DB_DATABASE=marginalia
DB_USERNAME=root
DB_PASSWORD=
```

---

## 5. Run Migrations & Seeders

```bash
php artisan migrate --seed
```

---

## 6. Start Backend Server

```bash
php artisan serve
```

---

# Frontend Setup (React)

## 1. Navigate to Frontend Directory

```bash
cd frontend
```

---

## 2. Install Packages

```bash
npm install
```

---

## 3. Configure API URL

Set the backend API URL inside your frontend environment configuration.

Example:

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## 4. Start Frontend Development Server

```bash
npm run dev
```

---

# 📊 Database Schema Summary

The backend relational database is built using the following core tables:

| Table        | Description                                                                        |
| ------------ | ---------------------------------------------------------------------------------- |
| `users`      | Stores user credentials, password hashes, Google OAuth IDs, and profile data       |
| `products`   | Stores e-book inventory, pricing, cover images, and Stripe product references      |
| `cart_items` | Maps products to authenticated users’ shopping carts                               |
| `orders`     | Stores checkout sessions, Stripe transaction IDs, payment status, and order totals |

---

# 🔐 Authentication Flow

The application supports two authentication methods:

## Traditional Authentication

* Email & Password Login
* Laravel Sanctum Token Generation
* Protected API Routes

## Google OAuth Login

* Secure third-party authentication via Google
* Automatic account linking using Socialite

---

# 💳 Secure Payment Flow

1. User adds products to cart
2. Backend creates Stripe checkout session
3. User completes payment securely on Stripe
4. Stripe sends signed webhook event
5. Backend validates signature
6. Order marked as paid only after verification

---

# ✅ Security Summary

The Marginalia platform successfully implements protection against:

* SQL Injection (SQLi)
* Cross-Site Scripting (XSS)
* Insecure Direct Object References (IDOR)
* Payment Webhook Forgery
* Unauthorized API Access

The application follows secure software engineering principles suitable for modern production-grade web systems.
