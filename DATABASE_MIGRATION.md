# Database Migration to PostgreSQL

This project has been migrated from SQLite to PostgreSQL for better compatibility with Render and other cloud platforms.

## Local Development Setup

### Option 1: Using Docker (Recommended)

1. Start PostgreSQL with Docker Compose:
```bash
docker-compose up db -d
```

2. Set up the database:
```bash
npx prisma migrate reset --force
```

3. Start the development server:
```bash
npm run dev
```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database:
```sql
CREATE DATABASE remix_recipes;
CREATE USER recipes_user WITH PASSWORD 'recipes_password';
GRANT ALL PRIVILEGES ON DATABASE remix_recipes TO recipes_user;
```

3. Update your `.env` file:
```env
DATABASE_URL="postgresql://recipes_user:recipes_password@localhost:5432/remix_recipes?schema=public"
```

### Option 3: SQLite (Local Development Only)

If you prefer SQLite for local development, you can switch back:

1. Update your `.env` file:
```env
DATABASE_URL="file:./dev.db"
```

2. Temporarily change `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Note**: Remember to switch back to PostgreSQL before deploying!

## Production Deployment on Render

The project is now configured for seamless Render deployment:

1. The `render.yaml` file automatically provisions a PostgreSQL database
2. Environment variables are configured automatically
3. Database migrations run during the build process

### Deploy to Render:

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically:
   - Create a PostgreSQL database
   - Set up the DATABASE_URL environment variable
   - Run migrations during deployment
   - Start your application

## Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset --force

# Seed database
npx prisma db seed
```

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps`
- Check connection string format
- Verify user permissions

### Migration Issues
- Reset migrations: `npx prisma migrate reset --force`
- Check schema syntax in `prisma/schema.prisma`

### Render Deployment Issues
- Check Render logs for detailed error messages
- Ensure `render.yaml` database name matches your service configuration
- Verify all environment variables are set correctly