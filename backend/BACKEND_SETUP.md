# Backend Configuration & Deployment

This document covers the backend setup for MoodMart Platform deployment.

## Backend Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB 7.0 (via Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Payments**: Stripe API
- **File Upload**: Multipart/form-data
- **Security**: bcryptjs for password hashing, CORS

## Local Development

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment Variables
Create `backend/.env` file with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/moodmart
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
CLIENT_URL=http://localhost:5173
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Start Development Server
```bash
npm run dev
```
Server runs at `http://localhost:5000`

### Available NPM Scripts
- `npm start` - Run production server
- `npm run dev` - Run with nodemon auto-reload
- `npm run seed` - Seed database with initial data
- `npm run encrypt-passwords` - Encrypt stored passwords

## Database Models

### User
- `id` (ObjectId)
- `name` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `role` (String: "user" or "admin")
- `createdAt` (Date)

### Product
- `id` (String, unique)
- `title` (String)
- `category` (String)
- `price` (Number)
- `description` (String)
- `image` (String)
- `rating` (Number)
- `reviews` (Number)

### Order
- `userId` (ObjectId, ref: User)
- `items` (Array of items with productId, quantity, price)
- `total` (Number)
- `status` (String: "pending", "completed", "cancelled")
- `paymentMethod` (String: "stripe", "paypal", etc.)
- `stripeSessionId` (String)
- `createdAt` (Date)

### AudioTrack
- `title` (String)
- `category` (String)
- `duration` (String)
- `description` (String)
- `audioUrl` (String)
- `image` (String)

## API Routes

### Authentication (`/api/auth`)
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login and get JWT token
GET    /api/auth/profile           Get current user profile (requires auth)
```

### Products (`/api/products`)
```
GET    /api/products               Get all products
GET    /api/products/:id           Get product by ID
POST   /api/products               Create new product (admin only)
PUT    /api/products/:id           Update product (admin only)
DELETE /api/products/:id           Delete product (admin only)
```

### Payments (`/api/payments`)
```
POST   /api/payments/create-checkout-session    Create Stripe session
GET    /api/payments/verify-payment             Verify payment
POST   /api/payments/webhook                    Stripe webhook (raw body)
```

### Orders (`/api/orders`)
```
POST   /api/orders                 Create new order
GET    /api/orders/:userId         Get user's orders
GET    /api/orders/detail/:orderId Get order details
```

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Token signing secret | `abc123xyz789...` |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_live_xxx` or `sk_test_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_xxx` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` or `https://domain.com` |
| `EMAIL_USER` | Email for notifications | `noreply@moodmart.com` |
| `EMAIL_PASS` | Email password/app-token | `xxxx xxxx xxxx xxxx` |

## Middleware

### CORS
- Configured to allow requests from `CLIENT_URL`
- Allows credentials (cookies)

### Authentication
- Route: `middleware/auth.js`
- Verifies JWT token from `Authorization: Bearer <token>` header
- Attaches user data to `req.user`

### Stripe Webhook
- Raw body parsing for webhook endpoint
- JSON parsing for other routes

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secret (32+ characters)
   - Rotate secrets regularly

2. **Password Security**
   - Passwords hashed with bcryptjs (salt rounds: 10)
   - Never send plaintext passwords in responses

3. **JWT Tokens**
   - Tokens expire after 7 days
   - Include user ID and role in token payload
   - Verify signature on protected routes

4. **CORS**
   - Restricted to frontend domain only
   - Credentials allowed for auth cookies

5. **Stripe**
   - Webhook secret required to verify payment events
   - Secret key stored in environment variables
   - Never expose secret key in frontend code

## Deployment on Vercel

### Configuration (vercel.json)
```json
{
  "experimentalServices": {
    "frontend": {
      "routePrefix": "/",
      "framework": "vite"
    },
    "backend": {
      "entrypoint": "backend/server.js",
      "routePrefix": "/_/backend"
    }
  }
}
```

### Required Environment Variables in Vercel
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Generated secret
- `STRIPE_SECRET_KEY` - Stripe secret
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `CLIENT_URL` - Production Vercel domain
- `EMAIL_USER` & `EMAIL_PASS` - Email credentials

### Note on Routes
- Backend API accessible at: `https://your-domain.vercel.app/_/backend/api/*`
- Frontend can use relative URL: `/_/backend` (recommended)
- Or full URL: `https://your-domain.vercel.app/_/backend`

## Database Seeding

Run seed script to populate initial data:
```bash
cd backend
npm run seed
```

This creates:
- Sample users
- Sample products
- Sample audio tracks
- Sample orders

**Warning**: This will clear existing data and replace with seed data.

## Troubleshooting

### Server Won't Start
```bash
# Check if port is already in use
netstat -an | grep 5000

# Try different port
PORT=3000 npm start
```

### MongoDB Connection Error
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running locally OR
- Check `MONGO_URI` environment variable points to valid MongoDB instance
- For Atlas: verify IP whitelist includes your IP

### JWT Token Invalid
- Check `JWT_SECRET` is same across backend instances
- Verify token hasn't expired
- Ensure Authorization header format: `Bearer <token>`

### Stripe Webhook Not Received
- Verify webhook endpoint URL is correct
- Check webhook secret (`STRIPE_WEBHOOK_SECRET`) is set
- Ensure POST endpoint receives raw body

### CORS Errors
- Verify `CLIENT_URL` is set correctly in backend
- Check CORS middleware is applied before routes
- Frontend should send requests with credentials if needed

## Performance Tips

1. **Database Queries**
   - Use indexes on frequently queried fields
   - Limit returned fields with `.select()`
   - Paginate large result sets

2. **Caching**
   - Consider Redis for session storage
   - Cache product listings

3. **Authentication**
   - JWT verification is fast (no database lookup)
   - Session-based auth requires DB queries

## Monitoring

### Logs
- Local: Console output when running with `npm run dev`
- Production: Vercel logs at `https://vercel.com/projects/[project]/deployments`

### Errors
- Check browser console for frontend errors
- Check Vercel deployment logs for backend errors
- Monitor Stripe webhook delivery status

## Related Documentation
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Auth](https://jwt.io/)
- [Stripe API](https://stripe.com/docs/api)
- [Vercel Backend Deployment](https://vercel.com/docs/functions/serverless-functions)
