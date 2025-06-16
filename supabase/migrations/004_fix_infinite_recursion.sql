-- Fix infinite recursion in RLS policies
-- Drop problematic policies and create simple ones

-- Drop all existing policies to clean slate
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "All users can view suppliers" ON suppliers;
DROP POLICY IF EXISTS "All users can manage suppliers" ON suppliers;
DROP POLICY IF EXISTS "All users can view products" ON products;
DROP POLICY IF EXISTS "All users can manage products" ON products;

-- Simple profile policies (no circular references)
CREATE POLICY "Enable read access for own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Simple policies for suppliers (authenticated users only)
CREATE POLICY "Enable all for authenticated users on suppliers" ON suppliers
  FOR ALL USING (auth.role() = 'authenticated');

-- Simple policies for products (authenticated users only)  
CREATE POLICY "Enable all for authenticated users on products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
