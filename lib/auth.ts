import { auth, currentUser } from '@clerk/nextjs/server'

export const getUserId = async () => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const getCurrentUser = async () => {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

// import { cookies } from 'next/headers'

// export async function getAccessToken(): Promise<string | undefined> {
//   const cookieStore = await cookies()
//   return cookieStore.get('access_token')?.value
// }

// export async function getUserId(): Promise<string> {
//   const token = await getAccessToken()
//   if (!token) throw new Error('Not authenticated')
//   const payload = JSON.parse(atob(token.split('.')[1]))
//   return String(payload.user_id)
// }