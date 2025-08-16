# 🔧 Fix Render Database Connection

The app is deployed but the database connection is failing. Here's how to fix it:

## Step 1: Create PostgreSQL Database on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New" → "PostgreSQL"**
3. **Configure the database:**
   - **Name**: `remix-recipes-db`
   - **Database**: `remix_recipes`
   - **User**: `remix_user`
   - **Region**: Same as your web service
   - **PostgreSQL Version**: 15 or latest
   - **Plan**: Free (for testing) or Starter ($7/month for production)

4. **Click "Create Database"**
5. **Wait for it to provision** (2-3 minutes)

## Step 2: Connect Database to Your Web Service

1. **Go to your web service** (`remix-recipes`)
2. **Click "Environment"** in the left sidebar
3. **Add Environment Variable:**
   - **Key**: `DATABASE_URL`
   - **Value**: Copy the **External Database URL** from your PostgreSQL service
     - Go to your PostgreSQL service → Info tab
     - Copy the "External Database URL" (starts with `postgresql://`)

## Step 3: Redeploy Your App

1. **Trigger a new deployment:**
   - Go to your web service
   - Click "Manual Deploy" → "Deploy Latest Commit"
   - OR push a small change to trigger auto-deploy

## Step 4: Verify It Works

- Visit: https://remix-recipes.onrender.com
- Check the logs for successful database connection
- You should see successful migration messages

## Alternative: Quick Fix Commands

Push this fix to trigger a redeploy:

```bash
git add .
git commit -m "fix: update render.yaml for manual database connection"
git push origin main
```

Then manually add the PostgreSQL database and DATABASE_URL as described above.

## Expected Result

After adding the DATABASE_URL environment variable, your app should:
1. Connect to PostgreSQL successfully
2. Run database migrations automatically
3. Display recipes and allow user registration

The error should disappear and your app will be fully functional!