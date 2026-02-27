#!/bin/bash

# JustCases Vercel Deployment Script
# This script will guide you through deploying to Vercel

set -e

echo "🚀 JustCases Vercel Deployment"
echo "=============================="
echo ""

# Check if user is logged into Vercel
echo "Step 1: Login to Vercel"
echo "----------------------"
vercel login

echo ""
echo "Step 2: Link to Vercel Project"
echo "------------------------------"
vercel link

echo ""
echo "Step 3: Set Environment Variables"
echo "---------------------------------"
echo "Setting up production environment variables..."

# Set the generated secrets
vercel env add JWT_SECRET production <<< "fjMf3bn2EZ4yKDYeDDIizoUtsHFgR6jatU7+2RYkPhc="
vercel env add NEXTAUTH_SECRET production <<< "VW2Z+OF+spMSd/kWuC8Agddf0PnkS6D5pICbYYxSPo0="

echo ""
echo "⚠️  IMPORTANT: You need to add these manually in Vercel Dashboard:"
echo ""
echo "1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
echo ""
echo "2. Create a Postgres Database:"
echo "   - Go to Storage tab → Create Database → Postgres"
echo "   - Copy the DATABASE_URL connection string"
echo ""
echo "3. Add DATABASE_URL with the connection string from step 2"
echo ""
echo "4. Set NEXTAUTH_URL to your Vercel domain (e.g., https://justcases.vercel.app)"
echo ""
echo "5. Optional: Add Stripe/PayPal keys if needed"
echo ""
echo "Press Enter when you've completed the above steps..."
read

echo ""
echo "Step 4: Deploy to Production"
echo "----------------------------"
vercel --prod

echo ""
echo "Step 5: Run Database Migrations"
echo "-------------------------------"
echo "⚠️  IMPORTANT: After deployment, you need to:"
echo ""
echo "1. Pull environment variables:"
echo "   vercel env pull .env.local"
echo ""
echo "2. Run migrations:"
echo "   npx prisma migrate deploy"
echo ""
echo "3. Seed the database (optional):"
echo "   npx prisma db seed"
echo ""
echo "✅ Deployment script complete!"
echo ""
echo "Your app should be live at: https://your-project.vercel.app"
echo ""
