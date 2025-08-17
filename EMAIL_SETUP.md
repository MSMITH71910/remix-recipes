# 📧 Email Configuration Guide

## Magic Link Authentication Setup

This guide covers setting up real email delivery for magic link authentication in your Remix Recipes application.

## Quick Setup with Resend (Recommended)

### 1. Sign up for Resend (FREE)
- Go to: https://resend.com
- Sign up with your email
- Verify your account

### 2. Get API Key
- In Resend dashboard, go to "API Keys"
- Create new API key
- Copy the key (starts with `re_`)

### 3. Add to Environment Variables
In your deployment platform (Render, Vercel, Railway, etc.):

```bash
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 4. Verify Domain (Optional but Recommended)
- In Resend dashboard, go to "Domains"
- Add your domain (or use resend.dev for testing)
- Follow DNS setup instructions

## Alternative: Mailgun Setup

If you prefer Mailgun:
```bash
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=yourdomain.com
MAILGUN_FROM_EMAIL=noreply@yourdomain.com
```

## Testing

1. Deploy with environment variables
2. Go to `/login`
3. Enter your email
4. Check your email inbox for magic link!

## Free Tier Limits

- **Resend**: 3,000 emails/month free
- **Mailgun**: 5,000 emails/month free (first 3 months)

## Without Email Service

If no email service is configured, the app will show magic links directly on screen (development mode).