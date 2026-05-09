import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Server-side endpoint to ensure a user's profile exists.
 * Uses get_my_profile() RPC (SECURITY DEFINER) for maximum reliability.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase no configurado' },
        { status: 500 }
      )
    }

    // Get the authenticated user from cookies
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'No autenticado', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      )
    }

    // Method 1: Use get_my_profile() RPC (most reliable - SECURITY DEFINER)
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_my_profile')

    if (!rpcError && rpcData && rpcData.length > 0) {
      const p = rpcData[0]
      return NextResponse.json({
        profile: {
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          role: p.role,
        },
        created: false,
      })
    }

    if (rpcError) {
      console.warn('[ensure-profile] get_my_profile RPC error:', rpcError.code, rpcError.message)
    }

    // Method 2: Try direct SELECT (may fail due to RLS)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profile) {
      return NextResponse.json({
        profile: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
        },
        created: false,
      })
    }

    // Method 3: Try to create the profile via RPC
    const metadataRole = user.user_metadata?.role
    const role = (metadataRole === 'administrador' || metadataRole === 'editor')
      ? metadataRole
      : 'editor'
    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'

    const { error: createRpcError } = await supabase.rpc('create_profile', {
      p_id: user.id,
      p_email: user.email || '',
      p_full_name: fullName,
      p_role: role,
    })

    if (!createRpcError) {
      // Re-fetch via get_my_profile
      const { data: retryData } = await supabase.rpc('get_my_profile')
      if (retryData && retryData.length > 0) {
        const p = retryData[0]
        return NextResponse.json({
          profile: {
            id: p.id,
            email: p.email,
            full_name: p.full_name,
            role: p.role,
          },
          created: true,
        })
      }
    }

    // Method 4: Direct INSERT as fallback
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: fullName,
        role,
      })
      .select()
      .maybeSingle()

    if (!insertError && insertData) {
      return NextResponse.json({
        profile: {
          id: insertData.id,
          email: insertData.email,
          full_name: insertData.full_name,
          role: insertData.role,
        },
        created: true,
      })
    }

    // All methods failed
    console.error('[ensure-profile] All methods failed. RPC:', rpcError?.message, 'INSERT:', insertError?.message)
    return NextResponse.json(
      {
        error: 'No se pudo crear el perfil. Ejecuta el SQL de corrección en Supabase.',
        code: 'PROFILE_CREATION_FAILED',
        details: {
          rpcError: rpcError?.message,
          createRpcError: createRpcError?.message,
          insertError: insertError?.message,
        },
      },
      { status: 500 }
    )
  } catch (err) {
    console.error('[ensure-profile] Exception:', err)
    return NextResponse.json(
      { error: `Error del servidor: ${(err as Error)?.message}` },
      { status: 500 }
    )
  }
}
