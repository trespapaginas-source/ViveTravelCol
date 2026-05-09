import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Supabase not configured' })
  }

  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  // Create Supabase client WITH cookies (authenticated)
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return allCookies
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })

  const results: Record<string, unknown> = {}

  // 1. Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  results.authUser = {
    email: user?.email ?? null,
    id: user?.id ?? null,
    role: user?.role ?? null,
    error: userError ? { message: userError.message } : null,
    metadata: user?.user_metadata ?? null,
  }

  if (user) {
    // 2. Test get_my_profile() RPC (SECURITY DEFINER - should always work)
    const { data: rpcProfile, error: rpcError } = await supabase.rpc('get_my_profile')
    results.getMyProfileRpc = {
      data: rpcProfile,
      error: rpcError ? { code: rpcError.code, message: rpcError.message } : null,
    }

    // 3. Query profiles as authenticated user (tests RLS)
    const { data: myProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    results.authedProfileQuery = {
      data: myProfile,
      error: profileError ? { code: profileError.code, message: profileError.message, details: profileError.details } : null,
    }

    // 4. Try to query ALL profiles (tests admin policy)
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('*')

    results.authedAllProfiles = {
      count: allProfiles?.length ?? 0,
      data: allProfiles,
      error: allError ? { code: allError.code, message: allError.message } : null,
    }
  }

  // 5. Environment info
  results.environment = {
    supabaseUrl,
    cookieCount: allCookies.length,
    cookieNames: allCookies.map(c => c.name),
  }

  return NextResponse.json(results, { status: 200 })
}
