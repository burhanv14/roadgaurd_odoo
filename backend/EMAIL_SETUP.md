# Email Setup Guide for RoadGuard Backend

This guide will help you set up email functionality using Nodemailer to send OTP verification emails.

## Prerequisites

1. Node.js and npm installed
2. A valid email account (Gmail, Outlook, Yahoo, or custom SMTP server)

## Installation

The required packages have already been installed:
- `nodemailer` - For sending emails
- `@types/nodemailer` - TypeScript types for nodemailer

## Configuration

### 1. Create Environment File

Copy the example environment file and configure your email settings:

```bash
cp env.example .env
```

### 2. Configure Email Settings

Edit your `.env` file and update the email configuration based on your email provider:

#### For Gmail:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
EMAIL_SECURE=false
```

**Important for Gmail:** You need to use an "App Password" instead of your regular password:
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings > Security > App passwords
3. Generate an app password for "Mail"
4. Use this app password in `EMAIL_PASS`

#### For Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
EMAIL_FROM=your_email@outlook.com
EMAIL_SECURE=false
```

#### For Yahoo:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@yahoo.com
EMAIL_SECURE=false
```

#### For Custom SMTP Server:
```env
EMAIL_HOST=your_smtp_server.com
EMAIL_PORT=587
EMAIL_USER=your_email@yourdomain.com
EMAIL_PASS=your_password
EMAIL_FROM=your_email@yourdomain.com
EMAIL_SECURE=false
```

## Testing Email Configuration

### 1. Test Email Setup

Start your server and test the email configuration:

```bash
npm run dev
```

Then make a GET request to test the email configuration:

```bash
curl http://localhost:3001/api/auth/test-email
```

Or visit: `http://localhost:3001/api/auth/test-email`

### 2. Test OTP Email

Register a new user to test the OTP email functionality:

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your_test_email@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

## Features

### 1. OTP Email Template

The email service includes a beautiful HTML template with:
- RoadGuard branding
- Clear OTP code display
- Security warnings
- Responsive design
- Professional styling

### 2. Email Service Functions

- `sendOtpEmail()` - Sends OTP verification emails
- `testEmailConfiguration()` - Tests email server connectivity
- Automatic error handling and logging

### 3. Integration Points

The email service is integrated into:
- User registration (signup)
- OTP resend functionality
- Automatic email sending on OTP generation

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check your email credentials
   - For Gmail, ensure you're using an App Password
   - Verify 2FA is enabled if required

2. **Connection Timeout**
   - Check your internet connection
   - Verify the SMTP host and port
   - Check firewall settings

3. **Email Not Received**
   - Check spam/junk folder
   - Verify the recipient email address
   - Check email provider's sending limits

### Debug Mode

Enable debug logging by adding this to your `.env`:

```env
NODE_ENV=development
```

This will show detailed email sending logs in the console.

## Security Considerations

1. **Environment Variables**: Never commit your `.env` file to version control
2. **App Passwords**: Use app-specific passwords for email services
3. **Rate Limiting**: Consider implementing rate limiting for OTP requests
4. **Email Validation**: Validate email addresses before sending

## Production Deployment

For production deployment:

1. Use a reliable email service (SendGrid, Mailgun, etc.)
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email delivery rates
4. Implement email queue system for high volume
5. Set up email templates for different scenarios

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify your email configuration
3. Test with a different email provider
4. Check the email service documentation
