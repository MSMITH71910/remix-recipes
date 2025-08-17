# Changelog

All notable changes to Remix Recipes by SmithDev Labs.

## [2.0.0] - 2025-01-16

### 🚀 Major Changes
- **BREAKING**: Migrated from SQLite to PostgreSQL for production compatibility
- Added seamless Render.com deployment support with automatic database provisioning

### ✨ New Features
- **PostgreSQL Integration**: Full migration to PostgreSQL with type safety
- **Render Blueprint**: Complete `render.yaml` configuration for one-click deployment
- **Dual Database Support**: Local development can use either PostgreSQL or SQLite
- **Enhanced Build Process**: Robust database initialization with fallback strategies
- **Docker Development Environment**: Docker Compose setup for local PostgreSQL testing

### 🔧 Technical Improvements
- Added `pg` PostgreSQL driver and TypeScript types
- Updated Prisma schema for PostgreSQL compatibility
- Enhanced `init-db.cjs` script with better error handling and environment detection
- Fixed ES module compatibility issues for build scripts
- Added comprehensive deployment documentation

### 🛠️ Configuration Changes
- Updated environment variables for better security (`AUTH_COOKIE_SECRET`)
- Enhanced `.env.example` with PostgreSQL connection examples
- Added development Docker Compose configuration
- Created comprehensive deployment and migration guides

### 📚 Documentation
- Added `RENDER_DEPLOYMENT.md` with step-by-step deployment guide
- Created `DATABASE_MIGRATION.md` with local development options
- Updated README with new deployment instructions

### 🔒 Security
- Automatic secret generation for production deployment on Render
- Proper environment variable management for sensitive data

## Migration Notes
- For local development, you can continue using SQLite by updating your `.env` file
- For production deployment, PostgreSQL is now the default and recommended database
- All existing data will need to be migrated manually if upgrading from a previous version

## Deployment Ready
Your app is now fully configured for seamless deployment on Render.com with:
- Automatic PostgreSQL database creation
- Zero-config deployment
- Health monitoring
- Robust error handling