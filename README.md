# MoodMart – Mental Wellness Platform + E-commerce Website ✨🧠🛒🌿💙

Welcome to the MoodMart experience — a premium wellness commerce platform crafted for elegant digital retail, healing journeys, and modern self-care.

## 🌟 Project Overview

MoodMart is a polished **MERN full-stack application** featuring:

* 🛒 Luxe shopping experience with smooth product browsing & cart system
* 💳 Secure Stripe checkout for seamless payments
* 📧 Automated order confirmation email notifications
* 🧘 Mood tracking, breathing therapy & guided audio wellness
* 👥 Community pages for engagement & support
* 📊 Smart dashboard with analytics insights
* 😌 Face scan support using Face-API models

## 🧭 Project Structure

* `backend/` — Express API, MongoDB, Stripe integration, Nodemailer email delivery
* `public/` — static assets and face-api model resources
* `src/` — React + Vite frontend source code, pages, components, and contexts
* `docker-compose.yml` — optional containerized local setup

## ✨ Key Features

* Secure authentication and cart checkout
* Stripe payment flow with order success verification
* Automatic order confirmation email after payment
* User-friendly dashboard and wellness journey pages
* Styled UI for mood and community engagement
* Face scan utilities for enhanced user experiences
* Audio therapy with guided wellness tracks
* Emotion-based personalized wellness experience

## 🛠️ Prerequisites

* Node.js 18+ / 20+
* npm 10+
* MongoDB available locally or remotely
* Stripe account with test API keys
* Gmail account with an App Password enabled for SMTP

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and add:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mernapp
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
STRIPE_WEBHOOK_SECRET=whsec_...
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal and run:

```bash
npm run dev
```

Open the app at:

```bash
http://localhost:5173
```

If the backend runs elsewhere, configure `VITE_API_URL` in your environment settings.

## 💳 Stripe Payment Flow

* Checkout creates a Stripe session through `/api/payments/create-checkout-session`
* Successful payment redirects to `/order-success?session_id={CHECKOUT_SESSION_ID}`
* The app verifies the paid session and sends the confirmation email

### Test Card Details

* Card number: `4242 4242 4242 4242`
* Expiry: any future date
* CVC: any 3 digits

## 📧 Email Setup

Nodemailer uses Gmail SMTP. Make sure you:

* Enable Google Two-Factor Authentication
* Generate a Gmail App Password
* Add the full 16-character App Password to `EMAIL_PASS`

## 🌐 Deployment

Frontend deployed with Vercel:



## 👩‍💻 Author

Developed by **Nethmini Jayamani**
