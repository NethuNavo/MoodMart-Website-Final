# Shipping Details Example

## Complete Checkout Example with Shipping Details

### Customer Information
```json
{
  "fullName": "Kalani Perera",
  "email": "kalani.perera@gmail.com",
  "phone": "+94 77 123 4567",
  "address": "123 Galle Road, Apartment 5B",
  "city": "Colombo",
  "state": "Western",
  "zipCode": "10100"
}
```

---

## Example 1: Colombo Customer (COD Payment)

| Field | Example Value | Notes |
|-------|---|---|
| **Full Name** | Kalani Perera | Required |
| **Email** | kalani.perera@gmail.com | For order confirmation |
| **Phone** | +94 77 123 4567 | Sri Lankan mobile format |
| **Address** | 123 Galle Road, Apartment 5B | Street address |
| **City** | Colombo | Main city |
| **State/Province** | Western | Optional |
| **Zip Code** | 10100 | Optional |

**Order Summary:**
- Product: Mindfulness Journal × 2 = Rs. 4,998.00
- Shipping: Rs. 300.00 (Free for orders > Rs. 5000)
- **Total: Rs. 5,298.00**
- Payment: Cash on Delivery ✓

---

## Example 2: Kandy Customer (Card Payment)

| Field | Example Value |
|-------|---|
| **Full Name** | Anjana Silva |
| **Email** | anjana.silva@hotmail.com |
| **Phone** | +94 81 234 5678 |
| **Address** | 456 Peradeniya Road, House No. 12 |
| **City** | Kandy |
| **State/Province** | Central |
| **Zip Code** | 20000 |

**Card Details:**
- Card Number: 4532 1488 0343 6467
- Cardholder Name: Anjana Silva
- Expiry Date: 12/27
- CVV: 123

**Order Summary:**
- Product: Lavender Essential Oil × 1 = Rs. 1,899.00
- Shipping: Rs. 300.00
- **Total: Rs. 2,199.00**
- Payment: Credit Card 💳

---

## Example 3: Galle Customer (Mobile Wallet Payment)

| Field | Example Value |
|-------|---|
| **Full Name** | Chaminda Jayawardena |
| **Email** | chaminda.j@outlook.com |
| **Phone** | +94 91 567 8901 |
| **Address** | 789 Lighthouse Street |
| **City** | Galle |
| **State/Province** | Southern |
| **Zip Code** | 90000 |

**Mobile Wallet Details:**
- Mobile Number: +94 77 123 4567
- Wallet App: eZ Cash / mCash / Genie

**Order Summary:**
- Product: The Anxiety Toolkit × 1 = Rs. 1,699.00
- Product: Meditation Cushion × 1 = Rs. 3,999.00
- Subtotal: Rs. 5,698.00
- Shipping: FREE (Order > Rs. 5000) ✓
- **Total: Rs. 5,698.00**
- Payment: Mobile Wallet 📱

---

## Example 4: Bank Transfer with Payment Slip

| Field | Example Value |
|-------|---|
| **Full Name** | Priya Weerasekera |
| **Email** | priya.wellness@gmail.com |
| **Phone** | +94 76 789 0123 |
| **Address** | 321 Independence Avenue, Flat 10A |
| **City** | Negombo |
| **State/Province** | Western |
| **Zip Code** | 11500 |

**Bank Transfer Details:**
- Bank: Commercial Bank
- Account: MoodMart Wellness
- Account Number: 1234567890
- Branch: Colombo
- Payment Slip: Uploaded (receipt_jan2026.pdf)

**Order Summary:**
- Product: Mindfulness Journal × 3 = Rs. 7,497.00
- Shipping: FREE (Order > Rs. 5000) ✓
- **Total: Rs. 7,497.00**
- Payment: Bank Transfer 🏦

---

## Validation Rules (Client-Side)

```javascript
// Required fields that MUST be filled
✓ Full Name (not empty)
✓ Email (valid email format)
✓ Phone (not empty, suggested: +94 format)
✓ Address (not empty)
✓ City (not empty)

// Optional fields
○ State/Province
○ Zip Code

// Payment-specific validations
If Card:
  ✓ Card Number: 13-19 digits
  ✓ Cardholder Name: not empty
  ✓ Expiry: MM/YY format, not expired
  ✓ CVV: 3-4 digits

If Mobile Wallet:
  ✓ Mobile Number: not empty

If Bank Transfer:
  ○ Payment Slip: optional file upload
```

---

## Common Sri Lankan Cities & Postal Codes

| City | Postal Code Range | Province |
|------|---|---|
| Colombo | 10100-10800 | Western |
| Kandy | 20000 | Central |
| Galle | 90000 | Southern |
| Negombo | 11500 | Western |
| Anuradhapura | 50000 | North Central |
| Jaffna | 40000 | Northern |
| Matara | 81000 | Southern |
| Trincomalee | 31000 | Eastern |

---

## Form Submission Example (JavaScript)

```javascript
const shippingDetails = {
  // Shipping Information
  fullName: "Kalani Perera",
  email: "kalani.perera@gmail.com",
  phone: "+94 77 123 4567",
  address: "123 Galle Road, Apartment 5B",
  city: "Colombo",
  state: "Western",
  zipCode: "10100",
  
  // Payment Information (varies by method)
  paymentMethod: "cod", // or "card", "mobile", "bank"
  
  // If Card Payment
  cardNumber: "4532 1488 0343 6467",
  cardName: "Kalani Perera",
  expiryDate: "12/27",
  cvv: "123",
  
  // Order Information (auto-calculated)
  subtotal: 4998.00,
  shipping: 300.00,
  total: 5298.00
};
```

---

## Current Process Flow

```
1️⃣  Customer fills shipping details
2️⃣  Selects payment method
3️⃣  Fills payment-specific details (if not COD)
4️⃣  Clicks "Place Order"
5️⃣  2-second processing delay (simulated)
6️⃣  Success message shown
7️⃣  Redirected to /order-success page
❌  NO DATA SAVED TO DATABASE (Issue!)
```

