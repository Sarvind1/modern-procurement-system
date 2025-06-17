# Project Brain - Modern Procurement System

## Architecture Overview

**Stack**: Next.js 14 (App Router) + Supabase + TypeScript + Tailwind CSS

**Key Design Decisions**:
- Server-first architecture using Server Components/Actions
- Row Level Security (RLS) for data protection
- Type-safe database operations with generated types
- Form handling via Server Actions (no client-side state management)
- **Microservices-ready**: Code structured for easy extraction when scaling

## Long-term Vision & Scaling Strategy

### Current Scope (MVP - Phase 1)
Building a SaaS platform for suppliers, traders, and Amazon sellers enabling global procurement and selling.

### Future Requirements
- **Marketplace Integrations**: Amazon, eBay, Shopify, etc.
- **D2C Setup**: Direct-to-consumer capabilities
- **FFW Tracking**: Freight forwarding and logistics
- **Document Management**: PDFs, invoices, customs docs
- **Multi-Portal System**: Supplier portal, vendor portal, buyer portal
- **ERP Integrations**: Multiple custom ERPs based on customer needs

### Scaling Architecture Plan

#### Phase 1 (Current - 0-6 months)
- Next.js + Supabase monolith
- PostgreSQL for relational data (ACID compliance for financial data)
- Server Actions for all business logic
- Start with API routes for PDF generation

#### Phase 2 (6-12 months)
- Extract complex operations to Next.js API routes
- Add queue system (Bull/SQS) for:
  - Marketplace sync operations
  - Document processing
  - Email notifications
- S3 for document storage
- Redis for caching hot data

#### Phase 3 (12-18 months) - Microservices Migration
```
Services to extract:
├── marketplace-sync-service    # Handle API integrations
├── document-service           # PDF generation, storage
├── inventory-service          # Real-time inventory across channels
├── shipping-service           # FFW tracking, logistics
├── notification-service       # Email, SMS, webhooks
└── analytics-service          # Reporting, data warehouse
```

#### Phase 4 (Scale)
- Event-driven architecture (Kafka/EventBridge)
- Multi-region deployment
- Elasticsearch for product search
- ML services for demand forecasting
- Data lake for analytics

### Code Patterns for Future Migration

**Service-Ready Structure**:
```typescript
// Current: Server Action
export async function createPurchaseOrder(data) {
  // Business logic here
}

// Future: Easy to extract to microservice
// Just move logic to express/fastify service
// Keep same function signature
```

**Database Access Pattern**:
```typescript
// Use repository pattern for easy migration
class PurchaseOrderRepository {
  async create(data) { /* Supabase now, custom DB later */ }
  async findById(id) { /* Easy to swap implementation */ }
}
```

**Why This Approach**:
- Start simple, validate product-market fit
- Current stack handles thousands of users easily
- PostgreSQL + proper indexing scales to millions of records
- Modular code makes service extraction straightforward
- Measure real bottlenecks before adding complexity

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
- `purchase_orders` - PO headers with status (uses `total_amount` column)
- `po_items` - Line items with calculated totals

**Security**: RLS policies allow authenticated users full access to all tables.

**Future Considerations**:
- PostgreSQL for transactional data (orders, inventory)
- Consider DynamoDB only for:
  - Session storage
  - User preferences
  - Real-time notifications
  - IoT/sensor data (if applicable)

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
- Shows total value of all purchase orders (using `total_amount` column)
- Lists recent purchase orders with status
- Includes error logging for debugging database issues

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
- ✅ Real-time dashboard metrics with proper error handling
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
7. Monitor browser console for database errors

## Recent Updates

- **Dashboard Fix (2025-06-16)**: 
  - Fixed dashboard showing 0 purchase orders by correcting column name from `total` to `total_amount`
  - Added error logging to help identify database schema mismatches
  - Dashboard now shows real-time counts and total values from database

- **Architecture Planning (2025-06-17)**:
  - Defined long-term vision as global procurement SaaS
  - Created phased approach for scaling from monolith to microservices
  - Established patterns for future service extraction
  - Confirmed PostgreSQL over NoSQL for ACID compliance

## Important Schema Notes

- Purchase orders table uses `total_amount` not `total` for the order value
- Always verify column names against migration files when debugging
- Use browser console to check for SQL errors like "column does not exist"

## Architecture Decision Log

### Why PostgreSQL over DynamoDB?
- **ACID compliance** crucial for financial transactions
- Complex relationships between orders, suppliers, inventory
- Rich querying needed for reports
- Foreign keys ensure data integrity
- DynamoDB only if we need 100k+ requests/second (unlikely for B2B)

### Why Start with Monolith?
- Faster time to market
- Easier to refactor when requirements are clear
- Avoid premature optimization
- Learn from real usage patterns
- Current stack easily handles thousands of users

### Service Extraction Triggers
Extract to microservices when:
- Marketplace sync takes >30 seconds
- PDF generation blocks user requests
- Need to scale teams independently
- Different services need different tech stacks
- Specific services need geographic distribution
