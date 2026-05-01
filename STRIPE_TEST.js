// Test Stripe Payment Integration
// Run this in browser console or as a separate test

const testStripePayment = async () => {
  const testData = {
    cart: [
      {
        id: '1',
        name: 'Lavender Essential Oil',
        price: 1899.00,
        quantity: 1,
        description: 'Pure lavender oil for relaxation and better sleep',
        image: 'https://images.unsplash.com/photo-1647934174425-61136513aed7?w=400&h=300&fit=crop'
      }
    ],
    shipping: 300,
    customer: {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+94 77 123 4567',
      address: '123 Test Street',
      city: 'Colombo',
      state: 'Western',
      zipCode: '10100',
      paymentMethod: 'card'
    }
  };

  try {
    console.log('Testing Stripe checkout session creation...');
    const response = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Response:', result);

    if (result.url) {
      console.log('✅ Stripe checkout URL created successfully!');
      console.log('Checkout URL:', result.url);
      console.log('Session ID:', result.sessionId);

      // Open in new window for testing
      window.open(result.url, '_blank');
    } else {
      console.error('❌ Failed to create checkout session:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Test payment verification
const testPaymentVerification = async (sessionId) => {
  try {
    console.log('Testing payment verification...');
    const response = await fetch('http://localhost:5000/api/payments/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId })
    });

    const result = await response.json();
    console.log('Verification result:', result);
  } catch (error) {
    console.error('Verification error:', error);
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testStripePayment = testStripePayment;
  window.testPaymentVerification = testPaymentVerification;
  console.log('🔥 Stripe test functions loaded!');
  console.log('Run: testStripePayment() to test checkout creation');
  console.log('Run: testPaymentVerification("session_id") to verify payment');
}