import { getCurrentProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  Plus
} from 'lucide-react'

export default async function DashboardPage() {
  const profile = await getCurrentProfile()
  const supabase = await createClient()

  // Fetch actual counts from database
  const [purchaseOrders, products, suppliers] = await Promise.all([
    supabase.from('purchase_orders').select('id, status, total').order('created_at', { ascending: false }),
    supabase.from('products').select('id', { count: 'exact' }),
    supabase.from('suppliers').select('id', { count: 'exact' })
  ])

  // Calculate metrics
  const totalPOs = purchaseOrders.data?.length || 0
  const activePOs = purchaseOrders.data?.filter(po => po.status === 'pending').length || 0
  const totalProducts = products.count || 0
  const totalSuppliers = suppliers.count || 0
  
  // Calculate total value (sum of all purchase orders)
  const totalValue = purchaseOrders.data?.reduce((sum, po) => sum + (po.total || 0), 0) || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {profile?.full_name || 'User'}
        </h1>
        <p className="text-gray-600">
          Manage your procurement operations efficiently
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/purchase-orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Purchase Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPOs}</div>
            <p className="text-xs text-muted-foreground">
              {activePOs} active orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              In catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Suppliers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Active suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All purchase orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>
              Latest purchase orders in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {purchaseOrders.data && purchaseOrders.data.length > 0 ? (
              <div className="space-y-4">
                {purchaseOrders.data.slice(0, 5).map((po) => (
                  <div key={po.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Order #{po.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Status: {po.status}
                      </p>
                    </div>
                    <div className="text-sm font-semibold">
                      ${po.total?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                ))}
                {purchaseOrders.data.length > 5 && (
                  <Link 
                    href="/dashboard/purchase-orders" 
                    className="text-sm text-blue-600 hover:underline block text-center pt-2"
                  >
                    View all purchase orders →
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity. Start by creating your first purchase order.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
