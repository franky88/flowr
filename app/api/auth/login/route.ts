import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password }),
  })
  if (!res.ok) return new Response('Invalid credentials', { status: 401 })

  const { access, refresh } = await res.json()
  ;(await cookies()).set('access_token', access, { httpOnly: true, secure: true, sameSite: 'lax' })
  ;(await cookies()).set('refresh_token', refresh, { httpOnly: true, secure: true, sameSite: 'lax' })
  return new Response(null, { status: 200 })
}