# Modern Procurement System

A comprehensive procurement management system built with Next.js 14, Supabase, and TypeScript.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS + Radix UI
- **Hosting**: Vercel

## 📋 Current Features (Phase 1)

### ✅ Basic Setup
- [x] Project configuration (Next.js, TypeScript, Tailwind)
- [x] ESLint and code formatting
- [x] Environment setup

### 🔄 In Progress
- [ ] Authentication system (login/signup)
- [ ] Purchase order module
- [ ] Basic dashboard layout

### 📌 Planned Features
- [ ] Products management
- [ ] Inventory tracking
- [ ] Suppliers management
- [ ] Shipments & logistics

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages group
│   ├── (dashboard)/       # Protected dashboard
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── forms/            # Form components
├── lib/                  # Utilities
│   ├── supabase/         # Supabase client
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
```

## 🛠️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sarvind1/modern-procurement-system.git
   cd modern-procurement-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema (Planned)

### Core Tables
- `profiles` - User profiles and roles
- `products` - Product catalog
- `suppliers` - Supplier information
- `purchase_orders` - PO headers
- `po_items` - PO line items
- `inventory_movements` - Stock tracking
- `shipments` - Delivery tracking

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Server-side authentication with Supabase
- TypeScript for type safety
- Input validation with Zod

## 📝 Development Principles

- **Beginner-friendly code**: Clear, readable, well-commented
- **Incremental development**: Small, working chunks
- **Server-first**: Prefer Server Components and Actions
- **Type safety**: TypeScript everywhere
- **Modern patterns**: Latest Next.js best practices

## 🚀 Deployment

- Automatic deployments via Vercel
- Environment variables configured in Vercel dashboard
- Preview deployments for feature branches
