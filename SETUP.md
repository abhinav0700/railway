# 🚂 RailConnect - Complete Setup Guide

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Neon Database Account** (free tier available)
3. **Git** for version control

## 🗄️ Step 1: Create Neon Database

### 1.1 Sign up for Neon
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project named "railconnect"

### 1.2 Get Database URL
1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string (it looks like):
   \`\`\`
   postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   \`\`\`

## ⚙️ Step 2: Environment Setup

### 2.1 Create Environment File
Create a `.env.local` file in your project root:

\`\`\`bash
# Copy from .env.example and fill in your values
cp .env.example .env.local
\`\`\`

### 2.2 Add Your Neon Database URL
Edit `.env.local`:

\`\`\`env
# Required: Your Neon Database URL
NEON_DATABASE_URL=postgresql://your-username:your-password@your-endpoint.neon.tech/neondb?sslmode=require

# Optional: Application Configuration
NEXT_PUBLIC_APP_NAME=RailConnect
NEXT_PUBLIC_APP_VERSION=1.0.0
PRICE_PER_KM=1.25
ENABLE_CONNECTING_ROUTES=true
\`\`\`

## 🏗️ Step 3: Database Setup

### 3.1 Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3.2 Run Database Scripts (in order)
\`\`\`bash
# 1. Create tables and indexes
npm run db:setup

# 2. Seed major stations
npm run db:seed

# 3. Generate 1000 test trains (optional)
npm run db:generate
\`\`\`

### 3.3 Verify Setup
\`\`\`bash
# Test database connection
npm run db:test
\`\`\`

## 🚀 Step 4: Run the Application

### 4.1 Development Mode
\`\`\`bash
npm run dev
\`\`\`

### 4.2 Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔍 Step 5: Verify Everything Works

### 5.1 Check Health Endpoint
Visit: `http://localhost:3000/api/health`

Should return:
\`\`\`json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "stations": 50,
    "trains": 1000,
    "routes": 5000
  }
}
\`\`\`

### 5.2 Test the Application
1. Go to `http://localhost:3000`
2. Select source and destination stations
3. Click "Search Trains"
4. Verify results appear

## 🛠️ Troubleshooting

### Database Connection Issues
\`\`\`bash
# Check if environment variables are loaded
npm run db:check-env

# Test connection manually
npm run db:test-connection
\`\`\`

### Common Issues

1. **"NEON_DATABASE_URL not found"**
   - Ensure `.env.local` exists and has the correct URL
   - Restart your development server

2. **"No trains found"**
   - Run the data generation script: `npm run db:generate`
   - Check if stations exist: `npm run db:check-data`

3. **Connection timeout**
   - Verify your Neon database is active
   - Check your internet connection

## 📊 Database Schema

\`\`\`sql
stations (id, name, code, state, zone, latitude, longitude)
trains (id, name, train_number, train_type)
train_routes (id, train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time)
\`\`\`

## 🔧 Configuration Options

Edit `lib/database.ts` to modify:
- `pricePerKm`: Price calculation rate
- `maxConnectingRoutes`: Maximum connecting routes to find
- `searchTimeout`: API timeout settings

## 📈 Performance Tips

1. **Database Indexing**: Already optimized with proper indexes
2. **Connection Pooling**: Handled by Neon automatically
3. **Query Optimization**: Uses efficient SQL queries
4. **Caching**: Consider adding Redis for production

## 🚀 Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
\`\`\`env
NEON_DATABASE_URL=your_production_database_url
NEXT_PUBLIC_APP_NAME=RailConnect
NODE_ENV=production
\`\`\`

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all environment variables
3. Test database connection
4. Check Neon dashboard for database status

---

🎉 **Congratulations!** Your RailConnect application is now ready to use!
