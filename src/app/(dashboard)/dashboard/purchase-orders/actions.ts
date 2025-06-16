'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createActionClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { generateSKU } from '@/lib/utils'

// Validation schemas
const createSupplierSchema = z.object({
  name: z.string().min(2, 'Supplier name must be at least 2 characters'),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  cost: z.number().min(0, 'Cost must be positive'),
})

const poItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
})

const createPurchaseOrderSchema = z.object({
  supplierId: z.string().uuid('Please select a supplier'),
  notes: z.string().optional(),
  items: z.array(poItemSchema).min(1, 'At least one item is required'),
})

/**
 * Server action to create a new supplier
 */
export async function createSupplier(formData: FormData) {
  await requireAuth()
  const supabase = await createActionClient()
  
  const validatedFields = createSupplierSchema.safeParse({
    name: formData.get('name'),
    contactPerson: formData.get('contactPerson'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { data, error } = await supabase
    .from('suppliers')
    .insert({
      name: validatedFields.data.name,
      contact_person: validatedFields.data.contactPerson,
      email: validatedFields.data.email || null,
      phone: validatedFields.data.phone,
      address: validatedFields.data.address,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/suppliers')
  return { success: true, data }
}

/**
 * Server action to create a new product
 */
export async function createProduct(formData: FormData) {
  await requireAuth()
  const supabase = await createActionClient()
  
  const validatedFields = createProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    unitOfMeasure: formData.get('unitOfMeasure'),
    cost: Number(formData.get('cost')),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const sku = generateSKU('PRD')

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      sku,
      unit_of_measure: validatedFields.data.unitOfMeasure,
      cost: validatedFields.data.cost,
      quantity_on_hand: 0,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/products')
  return { success: true, data }
}

/**
 * Server action to create a purchase order
 */
export async function createPurchaseOrder(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createActionClient()
  
  // Parse items from form data
  const items = []
  let itemIndex = 0
  
  while (formData.get(`items[${itemIndex}][productId]`)) {
    items.push({
      productId: formData.get(`items[${itemIndex}][productId]`) as string,
      quantity: Number(formData.get(`items[${itemIndex}][quantity]`)),
      unitPrice: Number(formData.get(`items[${itemIndex}][unitPrice]`)),
    })
    itemIndex++
  }

  const validatedFields = createPurchaseOrderSchema.safeParse({
    supplierId: formData.get('supplierId'),
    notes: formData.get('notes'),
    items,
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { supplierId, notes, items: validatedItems } = validatedFields.data
  
  // Calculate total amount
  const totalAmount = validatedItems.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice),
    0
  )

  // Generate PO number
  const poNumber = `PO-${Date.now()}`

  // Create purchase order
  const { data: po, error: poError } = await supabase
    .from('purchase_orders')
    .insert({
      po_number: poNumber,
      supplier_id: supplierId,
      total_amount: totalAmount,
      notes,
      created_by: user.id,
      status: 'draft',
    })
    .select()
    .single()

  if (poError) {
    return { error: poError.message }
  }

  // Create PO items
  const poItems = validatedItems.map(item => ({
    po_id: po.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }))

  const { error: itemsError } = await supabase
    .from('po_items')
    .insert(poItems)

  if (itemsError) {
    return { error: itemsError.message }
  }

  revalidatePath('/dashboard/purchase-orders')
  redirect(`/dashboard/purchase-orders/${po.id}`)
}
