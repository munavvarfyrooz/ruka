# Zoho Email Setup Instructions

## Important: App-Specific Password Required

Zoho Mail requires an **app-specific password** for SMTP authentication, not your regular account password.

## Steps to Generate App-Specific Password:

1. **Login to Zoho Mail**
   - Go to https://mail.zoho.com
   - Sign in with hi@ruka.live

2. **Access Security Settings**
   - Click on your profile icon (top-right)
   - Select "My Account"
   - Navigate to "Security" tab

3. **Enable Two-Factor Authentication (if not enabled)**
   - Click on "Two-factor authentication"
   - Follow the setup process

4. **Generate App-Specific Password**
   - In Security settings, find "Application-Specific Passwords"
   - Click "Generate New Password"
   - Enter a name like "Ruka Landing Page"
   - Copy the generated password

5. **Update Environment Variables**
   ```bash
   EMAIL_USER=hi@ruka.live
   EMAIL_PASS=[YOUR_APP_SPECIFIC_PASSWORD_HERE]
   SMTP_HOST=smtp.zoho.com
   SMTP_PORT=465
   ```

## Test Email Configuration

After updating the password, test the configuration:

```bash
node test-email.cjs
```

## Troubleshooting

- If authentication still fails, ensure:
  - Two-factor authentication is enabled on your Zoho account
  - You're using the app-specific password, not your account password
  - The email address matches exactly (hi@ruka.live)
  - Port 465 with SSL is being used

## Current Configuration

The email service is configured to:
- Send notifications to hi@ruka.live when:
  - New email subscriptions are received
  - New call requests are submitted
- Use Zoho SMTP with SSL on port 465
- Include TLS settings for compatibility