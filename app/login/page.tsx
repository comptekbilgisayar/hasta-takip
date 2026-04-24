'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (!error) router.push('/dashboard')
    else alert(error.message)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  )
}