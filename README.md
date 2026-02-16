# AuraCase - Premium Mobile Accessories E-Commerce

A modern, dark-themed e-commerce website for mobile device accessories built with Next.js 15, TypeScript, Tailwind CSS, and Prisma.

## Features

- 🎨 Modern dark UI design with accent colors
- 📱 Fully responsive layout
- 🛒 Shopping cart with persistent storage
- 🔍 Product filtering and search
- 🔐 Authentication ready with NextAuth.js
- 💳 Multiple payment method support
- 📦 Order management system
- 🗄️ Database ready with Prisma and PostgreSQL
- 🤖 AI-powered live chat support (Google Gemini integration)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database ORM**: Prisma
- **Database**: PostgreSQL (ready to connect)
- **State Management**: Zustand
- **Icons**: React Icons

## 🚀 Quick Start

> **📱 Прехвърляне на друг компютър?** Виж [TRANSFER_TO_OTHER_DEVICE.md](./TRANSFER_TO_OTHER_DEVICE.md) за лесно ръководство на български!

### Option 1: Automatic Setup

**For Windows:**
```bash
# Run the setup script
setup.bat
```

**For Mac/Linux:**
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
# Copy the example and edit as needed
cp env.example .env
```

3. **Setup database:**
```bash
npm run db:setup
```

4. **Start development server:**
```bash
npm run dev
```

### Option 3: One-Command Setup
```bash
npm run setup
```

##  Prerequisites

- **Node.js** v18 or higher - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-here"
```

**Generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗄️ Database

The project uses SQLite for development (no setup required). The database will be automatically created and seeded with sample data.

**Default admin account:**
- Email: `admin@auracase.com`
- Password: `admin123`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run setup` - Complete project setup
- `npm run reset` - Reset and reinstall everything
- `npm run prisma:studio` - Open database browser
- `npm run prisma:seed` - Seed database with sample data

## 🌐 Access the Application

After setup, open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── account/           # Account/profile page
│   ├── brands/            # Brands page
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── new-arrivals/      # New arrivals page
│   ├── on-sale/           # Sale items page
│   ├── product/[slug]/    # Product detail pages
│   ├── shop/              # Shop/catalog page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Site header
│   ├── Footer.tsx         # Site footer
│   └── ProductCard.tsx    # Product card component
├── lib/                   # Utility functions
│   ├── prisma.ts          # Prisma client
│   └── mockData.ts        # Mock product data
├── prisma/                # Prisma schema
│   └── schema.prisma      # Database schema
├── store/                 # State management
│   └── cartStore.ts       # Cart state with Zustand
└── public/                # Static assets
```

## Product Categories

- Phone Cases
- Screen Protectors
- Wireless Earphones
- Chargers & Cables
- Power Banks
- Adapters

## Pages

- **Homepage**: Hero section, featured products, categories, testimonials
- **Shop**: Product grid with filters (category, price, color, size)
- **Product Detail**: Image gallery, specifications, add to cart
- **Cart**: View cart items, update quantities, apply promo codes
- **Checkout**: Shipping info, payment methods, order summary
- **Account**: Profile, orders, addresses, payment methods, settings
- **New Arrivals**: Latest products
- **On Sale**: Discounted products
- **Brands**: Featured brands

## Database Schema

The Prisma schema includes:
- User authentication (with NextAuth)
- Products with categories
- Shopping cart and orders
- Customer reviews
- Multiple addresses and payment methods

## Future Enhancements

- Connect to real PostgreSQL database
- Implement actual payment processing
- Add product reviews and ratings
- Email notifications
- Order tracking
- Wishlist functionality
- Advanced search with filters
- Admin dashboard

## License

This project is created for AuraCase.

## Author

Built with ❤️ using Next.js

