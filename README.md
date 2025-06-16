# Modern Procurement System

A comprehensive procurement management system built with Next.js 14, Supabase, and TypeScript.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS + Radix UI
- **Hosting**: Vercel

## 📋 Current Features (Phase 1)

### ✅ Completed
- [x] Project configuration (Next.js, TypeScript, Tailwind)
- [x] ESLint and code formatting
- [x] Environment setup
- [x] Supabase integration with RLS policies
- [x] Authentication system (login/signup)
- [x] Dashboard layout with navigation
- [x] Purchase order module (basic CRUD)
- [x] Form components and UI library

### 🔄 In Progress
- [ ] Products management
- [ ] Suppliers management
- [ ] Purchase order details view

### 📌 Planned Features
- [ ] Inventory tracking
- [ ] Shipments & logistics
- [ ] Reporting and analytics
- [ ] Role-based permissions

## 🏗️ Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Auth pages group
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   └── actions.ts            # Auth server actions
│   ├── (dashboard)/              # Protected dashboard
│   │   ├── dashboard/            # Main dashboard
│   │   │   └── purchase-orders/  # PO management
│   │   └── layout.tsx            # Dashboard layout
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   └── forms/                   # Form components
│       └── create-po-form.tsx
├── lib/                         # Utilities
│   ├── supabase/               # Supabase clients
│   │   ├── server.ts           # Server-side client
│   │   └── client.ts           # Client-side client
│   ├── auth.ts                 # Auth helpers
│   └── utils.ts                # Helper functions
├── types/                      # TypeScript definitions
│   └── database.ts             # Database types
└── middleware.ts               # Route protection
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

4. **Database setup**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Push migrations
   supabase db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles and roles (linked to auth.users)
- `suppliers` - Supplier information
- `products` - Product catalog with SKU and pricing
- `purchase_orders` - PO headers with status tracking
- `po_items` - PO line items with calculated totals
- `inventory_movements` - Stock tracking (planned)

### Key Features
- **Row Level Security (RLS)** on all tables
- **Automatic profile creation** on user signup
- **Role-based access control** (admin/user)
- **Audit trails** with created_at/updated_at timestamps

## 🔒 Security Features

- Server-side authentication with Supabase
- Route protection via middleware
- RLS policies for data isolation
- TypeScript for type safety
- Input validation with Zod
- Server Actions for secure mutations

## 📱 Current Pages

### Authentication
- `/login` - User login with email/password
- `/signup` - User registration

### Dashboard
- `/dashboard` - Overview with quick actions and stats
- `/dashboard/purchase-orders` - PO listing
- `/dashboard/purchase-orders/new` - Create new PO

## 🎨 UI Components

Built with Radix UI primitives and Tailwind CSS:
- **Button** - Multiple variants and sizes
- **Card** - Container with header/content/footer
- **Input/Textarea** - Form inputs with validation styles
- **Select** - Dropdown with search and keyboard navigation
- **Label** - Accessible form labels

## 📝 Development Principles

- **Beginner-friendly code**: Clear, readable, well-commented
- **Incremental development**: Small, working chunks
- **Server-first**: Prefer Server Components and Actions
- **Type safety**: TypeScript everywhere
- **Modern patterns**: Latest Next.js best practices
- **Security-first**: RLS policies and validation

## 🔄 Next Development Steps

1. **Complete Purchase Order Flow**
   - PO detail view with edit capability
   - Status workflow (draft → pending → approved)
   - PDF generation for POs

2. **Product Management**
   - Product listing and creation
   - Inventory tracking
   - SKU management

3. **Supplier Management**
   - Supplier CRUD operations
   - Contact management
   - Performance tracking

4. **Enhanced Features**
   - File uploads (documents, images)
   - Email notifications
   - Advanced search and filtering
   - Reporting dashboard

## 🚀 Deployment

- Automatic deployments via Vercel
- Environment variables configured in Vercel dashboard
- Preview deployments for feature branches
- Production database on Supabase

## 📚 Documentation

- `/docs/supabase-setup.md` - Database setup guide
- `README.md` - This file (project overview)
- Inline JSDoc comments for all functions
- Type definitions for better IDE support
