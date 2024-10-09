// app/dashboard/UserData.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '../lib/database.types'

async function getUserData() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('users')
    .select('firstName')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user data:', error)
    return null
  }

  return data
}

export default async function UserData() {
  const userData = await getUserData()

  if (!userData) {
    return null
  }

  return <>{userData.firstName}</>
}