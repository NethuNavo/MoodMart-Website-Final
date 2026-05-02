MoodMart – Mental Wellness Platform + E-commerce Website ✨🧠🛒🌿💙

Welcome to the MoodMart experience — a premium wellness commerce platform crafted for elegant digital retail, healing journeys, and modern self-care.

## 🌟 Project Overview

MoodMart is a polished **MERN full-stack application** featuring:

- 🛒 Luxe shopping experience with smooth product browsing & cart system  
- 💳 Secure Stripe checkout for seamless payments  
- 📧 Automated order confirmation email notifications  
- 🧘 Mood tracking, breathing therapy & guided audio wellness  
- 👥 Community pages for engagement & support  
- 📊 Smart dashboard with analytics insights  
- 😌 Face scan support using Face-API models  

## 🧭 Project Structure

- `backend/` — Express API, MongoDB, Stripe integration, Nodemailer email delivery
- `client/` — React + Vite frontend with smooth UI flows
- `public/` — static assets and face-api model resources
- `src/` — main React app, pages, components, contexts
- `docker-compose.yml` — optional containerized local setup

## ✨ Key Features

- Secure authentication and cart checkout
- Stripe payment flow with order success verification
- Automatic order confirmation email after payment
- User-friendly dashboard and wellness journey pages
- Styled UI for mood and community engagement
- Face scan utilities for enhanced user experiences

## 🛠️ Prerequisites

- Node.js 18+ / 20+
- npm 10+
- MongoDB available locally or remotely
- Stripe account with test API keys
- Gmail account with an App Password enabled for SMTP

## 🚀 Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env` with your project settings:

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

> Use a Gmail App Password in `EMAIL_PASS` for secure SMTP delivery.

Start the backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

If the backend runs elsewhere, set `VITE_API_URL` in `client/.env`.

## 💳 Stripe Payment Flow

- Checkout creates a Stripe session through `/api/payments/create-checkout-session`
- Successful payment redirects to `/order-success?session_id={CHECKOUT_SESSION_ID}`
- The app verifies the paid session and sends the confirmation email

### Test card details

- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits

## 📧 Email Setup

Nodemailer uses Gmail SMTP. Make sure you:

- enable Google Two-Factor Authentication
- generate a Gmail App Password
- add the full 16-character code to `EMAIL_PASS`

## 🧩 Useful Commands

- Start backend: `cd backend && npm run dev`
- Start frontend: `cd client && npm run dev`
- Install backend deps: `cd backend && npm install`
- Install frontend deps: `cd client && npm install`

## 🔒 Notes

- Never commit `.env` files to GitHub
- Keep `backend/.env` credentials private
- Use Stripe test keys for development only

## 🛠️ Troubleshooting

- If port `5000` is busy, stop the current process or change `PORT`
- If SMTP login fails, confirm your Gmail app password and account setup
- If Stripe checkout fails, verify `STRIPE_SECRET_KEY` and `CLIENT_URL`
