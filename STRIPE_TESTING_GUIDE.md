# Stripe Payment Testing Guide - MoodMart

## ✅ Test Checklist

### 1. Backend Server Status
- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Stripe API keys loaded from .env

### 2. Frontend Setup
- [ ] Client running on port 5173 or 5174
- [ ] Cart has at least one product
- [ ] Network tab shows requests going to backend

### 3. Checkout Flow Testing

#### Test Case 1: Stripe Checkout Session Creation
```bash
# In browser console, run:
fetch('http://localhost:5000/api/payments/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cart: [
      {
        id: '1',
        name: 'Test Product',
        price: 1000,
        quantity: 1,
        description: 'Test',
        image: 'https://via.placeholder.com/100'
      }
    ],
    shipping: 300,
    customer: {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+94771234567',
      address: '123 Test St',
      city: 'Colombo',
      state: 'Western',
      zipCode: '10100',
      paymentMethod: 'Stripe'
    }
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Stripe URL:', data.url);
  console.log('✅ Session ID:', data.sessionId);
})
.catch(e => console.error('❌ Error:', e));
```

**Expected Result:**
```
✅ Stripe URL: https://checkout.stripe.com/c/pay/cs_test_...
✅ Session ID: cs_test_...
```

---

## 🧪 Full End-to-End Test

### Step 1: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should show: "Server running on port 5000" + "MongoDB connected"

# Terminal 2 - Frontend
cd client
npm run dev
# Should show: "VITE v5.0.0 ready in ... ms"
```

### Step 2: Navigate to Checkout
1. Open browser: `http://localhost:5174`
2. Go to **Shop** page
3. Add a product to cart (e.g., "Lavender Essential Oil")
4. Click **Cart icon** → **Proceed to Checkout**

### Step 3: Fill Shipping Details
```
Full Name:    Test User
Email:        test@example.com (MUST be valid email format)
Phone:        +94 77 123 4567
Address:      123 Test Street
City:         Colombo
State:        Western
Zip:          10100
```

### Step 4: Select Payment Method
- Select: **Stripe Checkout**
- Click the radio button

### Step 5: Click "Pay with Stripe"
- Button should say: **"Pay with Stripe"**
- Click it

### Step 6: Expected Result
✅ **You should be redirected to Stripe's checkout page**

If successful:
```
https://checkout.stripe.com/c/pay/cs_test_...
```

---

## 💳 Stripe Test Card Details

Use these test cards on Stripe's checkout page:

### ✅ Successful Payment
```
Card Number:  4242 4242 4242 4242
Expiry:       12/34
CVC:          123
```

### ❌ Declined Payment (for testing failures)
```
Card Number:  4000 0000 0000 0002
Expiry:       12/34
CVC:          123
```

### 🔄 3D Secure / Additional Authentication
```
Card Number:  4000 0025 0000 3155
Expiry:       12/34
CVC:          123
```

---

## ✅ Testing Results

### Scenario 1: Successful Payment
1. Fill checkout form with valid data
2. Select "Stripe Checkout"
3. Click "Pay with Stripe"
4. Use card: `4242 4242 4242 4242`
5. Complete payment

**Expected:**
- ✅ Browser redirects to success page
- ✅ URL shows: `/order-success?session_id=cs_test_...`
- ✅ Order confirmation displayed

### Scenario 2: Declined Payment
1. Same as above but use card: `4000 0000 0000 0002`

**Expected:**
- ❌ Payment declined message on Stripe page
- ✅ User can try again or go back

### Scenario 3: Other Payment Methods
1. Select **Cash on Delivery** → Click button
2. Should immediately go to success page (no Stripe)

**Expected:**
- ✅ Instant success without Stripe redirect

---

## 🔍 Debugging - Check Browser Console

### Backend API Working?
```javascript
// In browser console:
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(data => console.log('✅ API works:', data))
```

### Check Network Tab
1. Open DevTools → **Network** tab
2. Click "Pay with Stripe"
3. Look for request to: `POST /api/payments/create-checkout-session`
4. Check:
   - **Status**: Should be `200` ✅
   - **Response**: Should have `url` and `sessionId` ✅

### Check Console Errors
1. Open DevTools → **Console** tab
2. Look for red errors
3. Check for API error messages

---

## 🚨 Common Issues & Solutions

### Issue 1: "Payment setup failed"
**Cause:** Backend not responding or Stripe key invalid

**Solution:**
```bash
# Check backend is running
netstat -ano | findstr :5000

# Check .env has valid Stripe keys
cat backend/.env
# Should show:
# STRIPE_SECRET_KEY=sk_test_51TSB122X4ZTnleQMfgjAxcBuwcFp9...
# CLIENT_URL=http://localhost:5173
```

### Issue 2: "Failed to fetch"
**Cause:** CORS issue or backend not running

**Solution:**
```bash
# Backend is running? Check for errors
# Restart backend:
cd backend
npm run dev
```

### Issue 3: Browser doesn't redirect to Stripe
**Cause:** `data.url` is empty or API call failed

**Solution:**
```javascript
// In console, test directly:
const res = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cart: [{id:'1',name:'Test',price:1000,quantity:1}],
    shipping: 300,
    customer: {fullName:'Test',email:'test@test.com',phone:'+94777',address:'Test',city:'Colombo',state:'W',zipCode:'10100',paymentMethod:'Stripe'}
  })
});
console.log(await res.json());
```

---

## ✅ Verification Checklist

### Backend (.env)
- [ ] `STRIPE_SECRET_KEY` is set correctly
- [ ] `CLIENT_URL=http://localhost:5173` (or 5174)
- [ ] `MONGO_URI` is set
- [ ] `PORT=5000`

### Frontend (.env or vite.config)
- [ ] `VITE_API_URL=http://localhost:5000` (if needed)

### Stripe Dashboard
- [ ] Go to https://dashboard.stripe.com/test/payments
- [ ] You should see your test charge after successful payment

---

## 📊 Success Indicators

✅ **Payment succeeded when:**
1. Browser shows Stripe checkout page
2. Card charge appears in Stripe Dashboard
3. Browser redirects to `/order-success` page
4. Order details are displayed
5. Success toast appears

❌ **Payment failed when:**
1. "Payment setup failed" toast appears
2. Network request shows error in DevTools
3. Browser console shows error logs
4. Stripe page doesn't load

---

## 🎯 Quick Test Command

Run this in browser console to test Stripe API directly:

```javascript
const testStripe = async () => {
  console.log('🔄 Testing Stripe checkout...');
  try {
    const res = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        cart: [{id:'1',name:'Lavender Oil',price:1899,quantity:1,description:'Oil'}],
        shipping: 300,
        customer: {
          fullName:'Test User',
          email:'test@example.com',
          phone:'+94771234567',
          address:'123 St',
          city:'Colombo',
          state:'Western',
          zipCode:'10100',
          paymentMethod:'Stripe'
        }
      })
    });
    const data = await res.json();
    if (data.url) {
      console.log('✅ SUCCESS! Stripe URL:', data.url);
      console.log('Session ID:', data.sessionId);
      // Uncomment to redirect:
      // window.location.href = data.url;
    } else {
      console.error('❌ FAILED:', data);
    }
  } catch (e) {
    console.error('❌ ERROR:', e.message);
  }
};
testStripe();
```

---

## 📝 Test Report Template

```
Test Date: [Today's Date]
Environment: Local (localhost)

✅ Backend Status:    [Running/Not Running]
✅ Frontend Status:   [Running/Not Running]
✅ MongoDB:          [Connected/Disconnected]
✅ Stripe Keys:      [Valid/Invalid]

Test Case 1 - Stripe Checkout
Result: [Pass/Fail]
Error: [None/Description]

Test Case 2 - Payment Processing
Result: [Pass/Fail]
Card Used: 4242 4242 4242 4242
Error: [None/Description]

Test Case 3 - Order Success
Result: [Pass/Fail]
Session ID: [ID or N/A]

Notes:
[Any additional observations]
```
