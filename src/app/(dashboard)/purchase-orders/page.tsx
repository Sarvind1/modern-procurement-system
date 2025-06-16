import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function PurchaseOrdersPage() {
  const supabase = await createClient()
  
  const { data: purchaseOrders } = await supabase
    .from('purchase_orders')
    .select(`
      *,
      suppliers (name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <Button asChild>
          <Link href="/dashboard/purchase-orders/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New PO
          </Link>
        </Button>
      </div>

      {!purchaseOrders?.length ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No purchase orders yet. Create your first one to get started.
            </p>
            <Button asChild>
              <Link href="/dashboard/purchase-orders/new">
                Create Purchase Order
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {purchaseOrders.map((po) => (
            <Card key={po.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      PO #{po.po_number}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Supplier: {po.suppliers?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(po.total_amount)}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      po.status === 'approved' ? 'bg-green-100 text-green-800' :
                      po.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      po.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Created: {formatDate(po.created_at)}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/purchase-orders/${po.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
