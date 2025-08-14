# 🚀 Netlify Deployment Guide

This guide will help you deploy your Remix Recipes app to Netlify.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)

## 🌐 Netlify Deployment Steps

### 1. Connect Your Repository

1. Log into your Netlify dashboard
2. Click **"New site from Git"**
3. Choose **GitHub** and authorize Netlify
4. Select your `remix-recipes` repository

### 2. Configure Build Settings

Netlify should auto-detect these settings from `netlify.toml`, but verify:

- **Build command**: `npm run build:netlify`
- **Publish directory**: `build/client`
- **Node version**: `18`

### 3. Set Environment Variables

In your Netlify site dashboard, go to **Site settings > Environment variables** and add:

```bash
DATABASE_URL=file:./prisma/dev.db
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
```

**Important**: Generate a strong, unique `SESSION_SECRET` for production!

### 4. Deploy!

1. Click **"Deploy site"**
2. Netlify will build and deploy your app
3. You'll get a URL like: `https://amazing-recipe-app-123.netlify.app`

## ⚙️ Configuration Files

The following files are configured for Netlify deployment:

### `netlify.toml`
- Build configuration
- Redirect rules for SPA routing
- Security headers
- Static asset caching

### `package.json`
- Added `build:netlify` script
- Database setup commands
- Post-install hooks

## 🗃️ Database Considerations

This app uses SQLite, which works on Netlify with some limitations:

- **Development**: Perfect for testing and demo
- **Production**: Consider upgrading to PostgreSQL for high traffic
- **Data Persistence**: SQLite data persists between deployments

### Upgrading to PostgreSQL (Optional)

For production use, consider these alternatives:

1. **Neon** (PostgreSQL): [neon.tech](https://neon.tech)
2. **Supabase**: [supabase.com](https://supabase.com)  
3. **PlanetScale**: [planetscale.com](https://planetscale.com)

Update your `DATABASE_URL` environment variable accordingly.

## 🔧 Troubleshooting

### Build Fails
- Check Node version is 18+
- Verify all dependencies are in `package.json`
- Check environment variables are set

### Database Issues
- Ensure `DATABASE_URL` is set correctly
- Check if migrations ran successfully
- Verify seed data was created

### Routing Issues  
- Ensure `netlify.toml` redirects are configured
- Check that SPA fallback is working

## 📱 Testing Your Deployment

After deployment, test these features:

1. **Recipe Management**: Create, edit, delete recipes
2. **Pantry**: Add items to shelves
3. **Shopping List**: Generate and manage lists
4. **Mobile**: Test on phone/tablet
5. **Image Upload**: Upload recipe photos

## 🎯 Performance Optimization

Your app includes:

- **Static asset caching** (1 year)
- **Security headers**
- **Optimized build process**
- **Mobile-first responsive design**

## 🚀 Going Live

1. **Custom Domain** (Optional): Add your own domain in Netlify
2. **SSL Certificate**: Automatic with Netlify
3. **Analytics**: Enable Netlify Analytics
4. **Forms**: Use Netlify Forms for contact/feedback

## 📊 Monitoring

- **Netlify Analytics**: Built-in traffic analytics
- **Deploy Logs**: Check build and deploy status
- **Function Logs**: Monitor serverless functions

---

Your Remix Recipes app is now live and ready to use! 🎉