# Project Brain - Modern Procurement System

## Architecture Overview

**Stack**: Next.js 14 (App Router) + Supabase + TypeScript + Tailwind CSS

**Key Design Decisions**:
- Server-first architecture using Server Components/Actions
- Row Level Security (RLS) for data protection
- Type-safe database operations with generated types
- Form handling via Server Actions (no client-side state management)

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login/signup pages
│   │   ├── actions.ts       # Auth server actions
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/         # Protected routes
│   │   ├── layout.tsx       # Sidebar navigation
│   │   ├── dashboard/page.tsx  # Dashboard with real-time metrics
│   │   └── purchase-orders/
│   │       ├── actions.ts   # PO CRUD operations
│   │       ├── page.tsx     # PO listing
│   │       └── new/page.tsx # PO creation form
│   └── globals.css
├── components/
│   ├── ui/                  # Radix UI components
│   └── forms/               # Complex form components
├── lib/
│   ├── supabase/           # Database clients
│   ├── auth.ts             # Auth helpers
│   └── utils.ts            # Utilities
└── types/database.ts       # Supabase types
```

## Database Schema

**Core Tables**:
- `profiles` - User data linked to auth.users
- `suppliers` - Vendor information
- `products` - Product catalog with SKU/pricing
- `purchase_orders` - PO headers with status
- `po_items` - Line items with calculated totals

**Security**: RLS policies allow authenticated users full access to all tables.

## Key Implementation Details

### Authentication Flow
1. Server Actions handle login/signup with Zod validation
2. Middleware protects `/dashboard` routes
3. Server-side session management via cookies
4. Automatic profile creation on signup

### Data Access Pattern
```typescript
// Server Component data fetching
const supabase = await createClient()
const { data } = await supabase.from('table').select('*')

// Server Action mutations  
const supabase = await createActionClient()
await supabase.from('table').insert(data)
```

### Form Handling
- Client Components manage form state
- Server Actions handle validation and database operations
- Dynamic forms (PO creation) use indexed form data parsing
- Redirect after successful operations

### Dashboard Metrics
- Real-time data fetching from Supabase
- Displays actual counts for purchase orders, products, suppliers
- Shows total value of all purchase orders
- Lists recent purchase orders with status

### UI Components
- Radix UI primitives with Tailwind styling
- Reusable components following shadcn/ui patterns
- Type-safe props with database types

## Development Workflow

1. **Database**: Define schema in SQL migrations
2. **Types**: Generate TypeScript types from schema
3. **Server Actions**: Implement CRUD with validation
4. **Components**: Build UI with form handling
5. **Routes**: Create pages using Server Components

## Key Features Implemented

- ✅ User authentication (login/signup)
- ✅ Protected dashboard with navigation
- ✅ Real-time dashboard metrics
- ✅ Purchase order creation with dynamic line items
- ✅ Real-time form calculations
- ✅ Supplier/product data integration
- ✅ Server-side validation with Zod
- ✅ Type-safe database operations

## Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind customization  
- `postcss.config.js` - PostCSS with autoprefixer
- `tsconfig.json` - TypeScript configuration
- `supabase/config.toml` - Supabase CLI configuration

## Deployment Requirements

1. Supabase project with applied migrations
2. Environment variables in production
3. Vercel deployment (automatic via GitHub)

## Testing the System

1. Apply migrations: `supabase db push`
2. Add sample data via SQL Editor
3. Test authentication flow
4. Create purchase orders with multiple items
5. Verify data persistence and calculations
6. Check dashboard displays correct metrics

## Recent Updates

- **Dashboard Fix (2025-06-16)**: Updated dashboard to fetch real purchase order counts and metrics from database instead of showing hardcoded zeros
