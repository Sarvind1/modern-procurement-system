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
  console.log('🔐 Login attempt started')
  
  const supabase = await createActionClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  console.log('📧 Login attempt for email:', email)
  
  const validatedFields = loginSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    console.log('❌ Validation failed:', validatedFields.error.flatten().fieldErrors)
    return {
      error: 'Invalid fields',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log('✅ Validation passed, attempting Supabase auth...')

  const { data, error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    console.log('❌ Supabase auth error:', error.message)
    return {
      error: error.message,
    }
  }

  if (data.user) {
    console.log('✅ Login successful for user:', data.user.id)
    console.log('🔄 Revalidating paths and redirecting...')
  } else {
    console.log('⚠️ No user data returned from Supabase')
    return {
      error: 'Authentication failed - no user data',
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Server action to handle user signup
 */
export async function signup(formData: FormData) {
  console.log('📝 Signup attempt started')
  
  const supabase = await createActionClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  
  console.log('📧 Signup attempt for email:', email)
  
  const validatedFields = signupSchema.safeParse({ email, password, fullName })

  if (!validatedFields.success) {
    console.log('❌ Signup validation failed:', validatedFields.error.flatten().fieldErrors)
    return {
      error: 'Invalid fields',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log('✅ Signup validation passed, creating user...')

  const { data, error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        full_name: validatedFields.data.fullName,
      },
    },
  })

  if (error) {
    console.log('❌ Supabase signup error:', error.message)
    return {
      error: error.message,
    }
  }

  if (data.user) {
    console.log('✅ Signup successful for user:', data.user.id)
    console.log('🔄 Revalidating paths and redirecting...')
  } else {
    console.log('⚠️ No user data returned from signup')
    return {
      error: 'Signup failed - no user data',
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Server action to handle user logout
 */
export async function logout() {
  console.log('🚪 Logout attempt started')
  
  const supabase = await createActionClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.log('❌ Logout error:', error.message)
  } else {
    console.log('✅ Logout successful')
  }
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
