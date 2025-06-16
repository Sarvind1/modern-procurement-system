-- Updated RLS policies to allow regular users to access data
-- This migration updates existing policies to be less restrictive

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can manage suppliers" ON suppliers;
DROP POLICY IF EXISTS "Authenticated users can view products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- Create new user-friendly policies for suppliers
CREATE POLICY "All users can view suppliers" ON suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "All users can manage suppliers" ON suppliers
  FOR ALL USING (auth.role() = 'authenticated');

-- Create new user-friendly policies for products  
CREATE POLICY "All users can view products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "All users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Update purchase order policies to be less restrictive
DROP POLICY IF EXISTS "Admins can view all purchase orders" ON purchase_orders;
CREATE POLICY "All users can view purchase orders" ON purchase_orders
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update all purchase orders" ON purchase_orders;
CREATE POLICY "All users can update purchase orders" ON purchase_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Update PO items policies
DROP POLICY IF EXISTS "Admins can view all po items" ON po_items;
CREATE POLICY "All users can view po items" ON po_items
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage all po items" ON po_items;
CREATE POLICY "All users can manage po items" ON po_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Update inventory movements policies
DROP POLICY IF EXISTS "Admins can create inventory movements" ON inventory_movements;
CREATE POLICY "All users can manage inventory movements" ON inventory_movements
  FOR ALL USING (auth.role() = 'authenticated');
