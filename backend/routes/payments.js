const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const nodemailer = require('nodemailer')

// Email transporter configuration
const emailPassword = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : undefined
const emailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: emailPassword
  }
})

emailTransporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error)
  } else {
    console.log('Email transporter is ready')
  }
})

// Send order confirmation email
async function sendOrderConfirmationEmail(session) {
  try {
    const customerEmail = session.customer_details?.email || session.customer_email
    if (!customerEmail) {
      console.log('No customer email found, skipping email')
      return
    }

    console.log('Sending order confirmation email for session', session.id, 'to', customerEmail)

    // Get line items to show order details
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    
    // Create order details HTML
    const orderItemsHtml = lineItems.data.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.description}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs.${(item.amount_total / 100).toFixed(2)}</td>
      </tr>
    `).join('')

    const totalAmount = (session.amount_total / 100).toFixed(2)

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - MoodMart</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase from MoodMart</p>
          </div>
          
          <div style="background: white; border: 1px solid #ddd; border-radius: 0 0 10px 10px; padding: 30px;">
            <h2 style="color: #667eea; margin-top: 0;">Order Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">Quantity</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f8f9fa; font-weight: bold;">
                  <td colspan="2" style="padding: 15px; text-align: right;">Total Amount:</td>
                  <td style="padding: 15px; text-align: right; color: #667eea; font-size: 18px;">Rs.${totalAmount}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Your order is being processed</li>
                <li>You'll receive a shipping confirmation email within 24 hours</li>
                <li>Delivery typically takes 3-5 business days</li>
                <li>Track your order status in your account dashboard</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order Status</a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
              <p>Thank you for choosing MoodMart for your wellness journey! 🌱</p>
              <p>If you have any questions, contact us at <a href="mailto:support@moodmart.com">support@moodmart.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Order Confirmation - MoodMart Wellness',
      html: emailHtml
    }

    await emailTransporter.sendMail(mailOptions)
    console.log('Order confirmation email sent to:', customerEmail)
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    // Don't throw error - email failure shouldn't break payment flow
  }
}

// Create Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    // Validate environment
    if (!process.env.CLIENT_URL) {
      console.error('CLIENT_URL environment variable is not set')
      return res.status(500).json({ error: 'Server configuration error: CLIENT_URL not set' })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY environment variable is not set')
      return res.status(500).json({ error: 'Server configuration error: STRIPE_SECRET_KEY not set' })
    }

    const { cart, shipping, customer } = req.body

    // Validate required data
    if (!cart || !cart.length || !customer) {
      return res.status(400).json({ error: 'Missing required data: cart or customer' })
    }

    // Create line items for Stripe
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'lkr',
        product_data: {
          name: item.name,
          description: item.description || item.name,
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round(item.price * 100) // Convert to cents
      },
      quantity: item.quantity
    }))

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingCost = shipping || 300
    const total = subtotal + shippingCost

    // Create checkout session
    console.log('Creating Stripe session with CLIENT_URL:', process.env.CLIENT_URL)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        customer_email: customer.email,
        customer_name: customer.fullName,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_city: customer.city,
        customer_state: customer.state,
        customer_zip: customer.zipCode,
        payment_method: customer.paymentMethod || 'card',
        subtotal: subtotal.toString(),
        shipping: shippingCost.toString(),
        total: total.toString()
      },
      customer_email: customer.email,
      shipping_address_collection: {
        allowed_countries: ['LK'] // Sri Lanka only
      }
    })

    console.log('Stripe session created successfully:', session.id)
    console.log('Checkout URL:', session.url)
    res.json({
      url: session.url,
      sessionId: session.id
    })
  } catch (error) {
    console.error('Stripe checkout session error:', error.message || error)
    console.error('Error stack:', error.stack)
    console.error('Request body:', req.body)
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message,
      type: error.type
    })
  }
})

// Verify payment status (optional - for webhook handling)
router.post('/verify-payment', async (req, res) => {
  try {
    const { session_id } = req.body

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID required' })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    // Send confirmation email if payment was successful
    if (session.payment_status === 'paid') {
      await sendOrderConfirmationEmail(session)
    }

    res.json({
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
})

// Stripe webhook endpoint for automatic email sending
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Send confirmation email if payment was successful
    if (session.payment_status === 'paid') {
      await sendOrderConfirmationEmail(session)
    }
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true })
})

module.exports = router