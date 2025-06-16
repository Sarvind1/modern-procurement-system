'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createActionClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
})

/**
 * Server action to handle user login
 */
export async function login(formData: FormData) {
  const supabase = await createActionClient()
  
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Server action to handle user signup
 */
export async function signup(formData: FormData) {
  const supabase = await createActionClient()
  
  const validatedFields = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password, fullName } = validatedFields.data

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Server action to handle user logout
 */
export async function logout() {
  const supabase = await createActionClient()
  
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
