-- Row Level Security (RLS) policies for all tables
-- These policies ensure data security at the database level

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Suppliers policies
-- All authenticated users can view suppliers
CREATE POLICY "Authenticated users can view suppliers" ON suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can modify suppliers
CREATE POLICY "Admins can manage suppliers" ON suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies
-- All authenticated users can view products
CREATE POLICY "Authenticated users can view products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can modify products
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Purchase orders policies
-- Users can view their own purchase orders
CREATE POLICY "Users can view own purchase orders" ON purchase_orders
  FOR SELECT USING (created_by = auth.uid());

-- Admins can view all purchase orders
CREATE POLICY "Admins can view all purchase orders" ON purchase_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can create purchase orders
CREATE POLICY "Users can create purchase orders" ON purchase_orders
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update their own draft purchase orders
CREATE POLICY "Users can update own draft purchase orders" ON purchase_orders
  FOR UPDATE USING (
    created_by = auth.uid() AND status = 'draft'
  );

-- Admins can update any purchase order
CREATE POLICY "Admins can update all purchase orders" ON purchase_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Purchase order items policies
-- Users can view items for their own purchase orders
CREATE POLICY "Users can view own po items" ON po_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_orders 
      WHERE id = po_items.po_id AND created_by = auth.uid()
    )
  );

-- Admins can view all po items
CREATE POLICY "Admins can view all po items" ON po_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can manage items for their own draft purchase orders
CREATE POLICY "Users can manage own po items" ON po_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM purchase_orders 
      WHERE id = po_items.po_id 
        AND created_by = auth.uid() 
        AND status = 'draft'
    )
  );

-- Admins can manage all po items
CREATE POLICY "Admins can manage all po items" ON po_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inventory movements policies
-- All authenticated users can view inventory movements
CREATE POLICY "Authenticated users can view inventory movements" ON inventory_movements
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can create inventory movements
CREATE POLICY "Admins can create inventory movements" ON inventory_movements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) AND created_by = auth.uid()
  );

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
