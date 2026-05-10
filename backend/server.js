require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Other routes need JSON
app.use(express.json());

connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/payments', require('./routes/payments'));

app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime()
    },
    config: {
      port: process.env.PORT || 5000,
      mongoUri: process.env.MONGO_URI ? 'set' : 'not set',
      jwtSecret: process.env.JWT_SECRET ? 'set' : 'not set',
      clientUrl: process.env.CLIENT_URL ? 'set' : 'not set',
      stripeSecret: process.env.STRIPE_SECRET_KEY ? 'set' : 'not set',
      emailUser: process.env.EMAIL_USER ? 'set' : 'not set',
      emailPass: process.env.EMAIL_PASS ? 'set' : 'not set',
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'set' : 'not set'
    }
  };
  res.json(health);
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal server error', details: err.message || 'Unknown error' });
});

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message || err);
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
