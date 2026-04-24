'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [visits, setVisits] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  const [profile, setProfile] = useState<any>(null)

  // USER + PROFILE
  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser()
      const u = data.user

      setUser(u)

      if (!u) return

      const { data: prof } = await supabase
        .from('profiles')
        .select('subscription_status, plan, clinic_id')
        .eq('id', u.id)
        .single()

      setProfile(prof)
    }

    init()
  }, [])

  // DATA LOAD
  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const p = await supabase.from('patients').select('*')
    const a = await supabase.from('appointments').select('*')
    const v = await supabase.from('visits').select('*')
    const pay = await supabase.from('payments').select('*')

    setPatients(p.data || [])
    setAppointments(a.data || [])
    setVisits(v.data || [])
    setPayments(pay.data || [])
  }

  const today = new Date().toDateString()

  const todayAppointments = appointments.filter((a) =>
    new Date(a.date).toDateString() === today
  )

  const todayVisits = visits.filter((v) =>
    new Date(v.visit_date).toDateString() === today
  )

  const totalIncome = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  )

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toDateString()

  const tomorrowAppointments = appointments.filter((a) =>
    new Date(a.date).toDateString() === tomorrowStr
  )

  // SAAS KONTROL
  if (profile && profile.subscription_status !== 'active') {
    return <h2>🚫 Aboneliğiniz aktif değil</h2>
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>📊 Klinik Dashboard</h1>

      {/* CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 10,
        marginTop: 20
      }}>

        <div style={card}>
          👤 <b>Hastalar</b>
          <h2>{patients.length}</h2>
        </div>

        <div style={card}>
          📅 <b>Bugün Randevu</b>
          <h2>{todayAppointments.length}</h2>
        </div>

        <div style={card}>
          🧾 <b>Bugün Muayene</b>
          <h2>{todayVisits.length}</h2>
        </div>

        <div style={card}>
          💰 <b>Toplam Gelir</b>
          <h2>{totalIncome} ₺</h2>
        </div>

      </div>

      {/* TOMORROW */}
      <div style={{ marginTop: 20, padding: 15, background: '#fff', border: '1px solid #ddd' }}>
        <h3>🔔 Yarınki Randevular</h3>

        {tomorrowAppointments.length === 0 ? (
          <p>Yarın randevu yok</p>
        ) : (
          tomorrowAppointments.map((a) => (
            <div key={a.id} style={{ padding: 5 }}>
              📅 {new Date(a.date).toLocaleString()} - {a.note}
            </div>
          ))
        )}
      </div>

    </div>
  )
}

const card = {
  background: '#fff',
  padding: 20,
  borderRadius: 10,
  border: '1px solid #ddd'
}