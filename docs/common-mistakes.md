# Common Mistakes & Developer Reference

## Critical Issues Found During Development

### 1. Missing Dependencies
**Problem**: Components failed to compile due to missing packages
- `@radix-ui/react-label` - Required for Label component
- `autoprefixer` - Required for PostCSS/Tailwind

**Fix**: Add to package.json devDependencies
```bash
npm install @radix-ui/react-label autoprefixer
```

### 2. Import Path Errors
**Problem**: Relative imports broke when restructuring routes
```typescript
// ❌ Broken
import { login } from './actions'
import { createPurchaseOrder } from '../actions'

// ✅ Fixed  
import { login } from '../actions'
import { createPurchaseOrder } from '@/app/(dashboard)/purchase-orders/actions'
```

**Fix**: Use absolute imports or verify relative paths after route changes

### 3. Route Structure Issues
**Problem**: Nested `/dashboard/dashboard/` URLs from incorrect folder structure
```
❌ Bad: src/app/(dashboard)/dashboard/purchase-orders/
✅ Good: src/app/(dashboard)/purchase-orders/
```

**Fix**: Keep route groups flat, avoid double nesting

### 4. RLS Policy Infinite Recursion
**Problem**: Policies referencing profiles table created circular dependencies
```sql
-- ❌ Caused infinite recursion
CREATE POLICY "All users can view suppliers" ON suppliers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

**Fix**: Use simple `auth.role() = 'authenticated'` checks
```sql
-- ✅ Simple and works
CREATE POLICY "Enable all for authenticated users on suppliers" ON suppliers
  FOR ALL USING (auth.role() = 'authenticated');
```

### 5. Missing Configuration Files
**Problem**: Build errors from missing standard config files
- `postcss.config.js` - Required for Tailwind
- `next-env.d.ts` - TypeScript references

**Fix**: Create standard config files:
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 6. Server Action Redirect to Non-existent Route
**Problem**: 404 after form submission
```typescript
// ❌ Redirects to non-existent route
redirect(`/dashboard/purchase-orders/${po.id}`)

// ✅ Redirects to existing route
redirect('/dashboard/purchase-orders')
```

### 7. Authentication Flow Issues
**Problem**: Login succeeded but stayed on login page
- Missing error handling in forms
- Silent auth failures
- No user feedback

**Fix**: Add comprehensive logging and error states

### 8. Overly Restrictive RLS Policies
**Problem**: Regular users couldn't access data due to admin-only policies
**Fix**: Allow authenticated users to read/write core data

### 9. Database Column Name Mismatches
**Problem**: Dashboard showed 0 purchase orders despite data existing
```typescript
// ❌ Wrong column name
const { data } = await supabase.from('purchase_orders').select('id, status, total')

// ✅ Correct column name from schema
const { data } = await supabase.from('purchase_orders').select('id, status, total_amount')
```

**Fix**: Always verify actual database column names against schema
- Check migration files for exact column names
- Database uses `total_amount` not `total` for purchase_orders
- Products/suppliers counts worked because they were using count queries

**Debugging Steps**:
1. Check browser console for database errors
2. Look for SQL error messages like "column does not exist"
3. Verify column names in migration files
4. Add error logging to identify issues

## Best Practices Learned

### File Organization
```
src/
├── app/
│   ├── (auth)/           # Auth routes group
│   ├── (dashboard)/      # Protected routes group  
│   └── globals.css
├── components/
│   ├── ui/              # Base components
│   └── forms/           # Form components
├── lib/
│   ├── supabase/        # DB clients
│   ├── auth.ts          # Auth helpers
│   └── utils.ts         # Utilities
└── types/
    └── database.ts      # Type definitions
```

### Import Strategy
1. Use absolute imports for cross-module references
2. Use relative imports only within same directory
3. Always verify paths after restructuring

### Database Policies
1. Start simple with `auth.role() = 'authenticated'`
2. Avoid circular references between tables
3. Test policies with actual users, not just admin

### Error Handling
1. Add comprehensive logging to server actions
2. Provide user feedback for all error states
3. Use proper TypeScript error types
4. Log database errors to identify column name issues

### Dependency Management
1. Install all required peer dependencies
2. Keep package.json updated in repo
3. Use exact versions for critical packages

### Development Workflow
1. Apply migrations immediately: `supabase db push`
2. Test with actual user accounts, not just signup
3. Verify all routes exist before redirecting
4. Check browser network tab for API errors
5. Always verify database schema matches code expectations

## Quick Debugging Checklist

### Build Errors
- [ ] All dependencies installed?
- [ ] Import paths correct?
- [ ] Config files present?

### Database Issues  
- [ ] RLS policies too restrictive?
- [ ] Migrations applied?
- [ ] User authenticated?
- [ ] Column names match schema?

### Route Errors
- [ ] File structure matches URLs?
- [ ] Redirect targets exist?
- [ ] Middleware allowing access?

### Auth Problems
- [ ] Environment variables set?
- [ ] Server actions returning errors?
- [ ] Session persisting correctly?
