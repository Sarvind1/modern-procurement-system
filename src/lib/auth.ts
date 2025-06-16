import { redirect } from 'next/navigation'
import { createClient } from './server'
import { Profile } from '@/types/database'

/**
 * Gets current user session
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

/**
 * Gets current user profile with role
 * @returns Profile data or null
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Requires authentication, redirects to login if not authenticated
 * @param redirectTo - Path to redirect to after login
 * @returns User data
 */
export async function requireAuth(redirectTo?: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    const params = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
    redirect(`/login${params}`)
  }
  
  return user
}

/**
 * Requires admin role, redirects if not admin
 * @returns Profile data for admin user
 */
export async function requireAdmin() {
  const profile = await getCurrentProfile()
  
  if (!profile || profile.role !== 'admin') {
    redirect('/unauthorized')
  }
  
  return profile
}

/**
 * Checks if user has specific role
 * @param role - Role to check
 * @returns Boolean indicating if user has role
 */
export async function hasRole(role: 'admin' | 'user'): Promise<boolean> {
  const profile = await getCurrentProfile()
  return profile?.role === role ?? false
}
