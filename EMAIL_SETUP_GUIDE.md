# Email Configuration Guide for MoodMart

## Setting up Email Notifications

To send order confirmation emails after successful Stripe payments, you need to configure Gmail SMTP.

### Step 1: Enable 2-Factor Authentication (2FA)
1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security > 2-Step Verification > App passwords
3. Select "Mail" and "Other (custom name)"
4. Enter "MoodMart" as the custom name
5. Click "Generate"
6. Copy the 16-character password

### Step 3: Update Environment Variables
In your `backend/.env` file, update these variables:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

Replace:
- `your_email@gmail.com` with your actual Gmail address
- `your_16_character_app_password` with the app password you generated

### Important Notes:
- Never use your regular Gmail password
- The app password is only shown once - save it securely
- For production, consider using services like SendGrid, Mailgun, or AWS SES
- Test the email functionality after configuration

### Testing Email:
After configuration, make a test Stripe payment and check if you receive the confirmation email.