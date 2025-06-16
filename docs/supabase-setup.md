# Supabase Setup Guide

## Quick Setup Steps

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create new project
   - Copy your project URL and anon key

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials to .env.local
   ```

3. **Database Setup**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Push migrations
   supabase db push
   ```

4. **Verify Setup**
   - Check tables created in Supabase dashboard
   - Verify RLS policies are active
   - Test authentication flow

## Database Schema

### Tables Created
- `profiles` - User profiles with roles
- `suppliers` - Supplier information
- `products` - Product catalog
- `purchase_orders` - PO headers
- `po_items` - PO line items
- `inventory_movements` - Stock tracking

### Security Features
- Row Level Security (RLS) enabled
- Role-based access control
- Automatic profile creation on signup
- Secure cookie-based sessions

## Files Added
- `/src/lib/supabase/server.ts` - Server-side client
- `/src/lib/supabase/client.ts` - Client-side client
- `/src/lib/auth.ts` - Authentication helpers
- `/src/middleware.ts` - Route protection
- `/supabase/migrations/` - Database schema
