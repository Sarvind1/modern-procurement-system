'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { Product, Supplier } from '@/types/database'
import { createPurchaseOrder } from '../../app/(dashboard)/dashboard/purchase-orders/actions'
import { formatCurrency } from '@/lib/utils'

interface CreatePOFormProps {
  suppliers: Supplier[]
  products: Product[]
}

interface POItem {
  productId: string
  quantity: number
  unitPrice: number
}

export default function CreatePOForm({ suppliers, products }: CreatePOFormProps) {
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<POItem[]>([
    { productId: '', quantity: 1, unitPrice: 0 }
  ])

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof POItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const getProductPrice = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.cost || 0
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      updateItem(index, 'productId', productId)
      updateItem(index, 'unitPrice', product.cost)
    }
  }

  return (
    <form action={createPurchaseOrder} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supplier">Supplier *</Label>
            <Select name="supplierId" value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              name="notes"
              placeholder="Additional notes or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Items</CardTitle>
            <Button type="button" onClick={addItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label>Product *</Label>
                  <Select 
                    name={`items[${index}][productId]`}
                    value={item.productId}
                    onValueChange={(value) => handleProductSelect(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.cost)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    name={`items[${index}][quantity]`}
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Unit Price *</Label>
                  <Input
                    type="number"
                    name={`items[${index}][unitPrice]`}
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Total</Label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                </div>

                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-xl font-bold">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Create Purchase Order
        </Button>
      </div>
    </form>
  )
}
