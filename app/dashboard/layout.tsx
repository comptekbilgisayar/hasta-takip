'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push('/login')
      return
    }

    setUser(data.user)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        background: '#111',
        color: '#fff',
        padding: 20
      }}>
        <h2>🏥 Klinik</h2>

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          {user?.email}
        </p>

        <hr style={{ margin: '15px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="/dashboard" style={{ color: '#fff' }}>📊 Dashboard</a>
          <a href="/dashboard/patients" style={{ color: '#fff' }}>👤 Hastalar</a>
          <a href="/dashboard/appointments" style={{ color: '#fff' }}>📅 Randevular</a>
          <a href="/dashboard/visits" style={{ color: '#fff' }}>📅 Muayeneler</a>
          <a href="/dashboard/payments" style={{ color: '#fff' }}>📅 Kasa</a>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div style={{ flex: 1 }}>

        {/* TOPBAR */}
        <div style={{
          height: 60,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid #ddd'
        }}>
          <h3>Dashboard</h3>

          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
          >
            Çıkış
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ padding: 20 }}>
          {children}
        </div>

      </div>
    </div>
    
 )
 
}
