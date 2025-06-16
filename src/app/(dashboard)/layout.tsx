import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { logout } from '../(auth)/actions'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Truck,
  Home,
  LogOut
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-xl font-bold text-gray-900">
              Procurement System
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            <Link
              href="/dashboard"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/purchase-orders"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              Purchase Orders
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Package className="mr-3 h-5 w-5" />
              Products
            </Link>
            <Link
              href="/dashboard/suppliers"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Users className="mr-3 h-5 w-5" />
              Suppliers
            </Link>
            <Link
              href="/dashboard/shipments"
              className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Truck className="mr-3 h-5 w-5" />
              Shipments
            </Link>
          </nav>

          {/* User section */}
          <div className="border-t px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <form action={logout}>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
