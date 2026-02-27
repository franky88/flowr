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