import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreatePOForm from '@/components/forms/create-po-form'

export default async function NewPurchaseOrderPage() {
  const supabase = await createClient()
  
  // Fetch suppliers and products for the form
  const [suppliersResult, productsResult] = await Promise.all([
    supabase.from('suppliers').select('*').order('name'),
    supabase.from('products').select('*').order('name')
  ])

  const suppliers = suppliersResult.data || []
  const products = productsResult.data || []

  // Debug logging
  console.log('📊 Suppliers found:', suppliers.length)
  console.log('📦 Products found:', products.length)
  console.log('🔍 Suppliers error:', suppliersResult.error)
  console.log('🔍 Products error:', productsResult.error)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard/purchase-orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchase Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Purchase Order</h1>
      </div>

      {suppliers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground mb-4">
            You need to add suppliers and products before creating a purchase order.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/dashboard/suppliers/new">
                Add Supplier
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/products/new">
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground mb-4">
            You need to add products before creating a purchase order.
          </p>
          <Button asChild>
            <Link href="/dashboard/products/new">
              Add Product
            </Link>
          </Button>
        </div>
      ) : (
        <CreatePOForm suppliers={suppliers} products={products} />
      )}
    </div>
  )
}
