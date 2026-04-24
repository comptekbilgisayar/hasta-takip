'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [visits, setVisits] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // USER + PROFILE
  useEffect(() => {
    init()
  }, [])

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

    loadAll()
  }

  // DATA LOAD
  async function loadAll() {
    const [p, a, v, pay] = await Promise.all([
      supabase.from('patients').select('*'),
      supabase.from('appointments').select('*'),
      supabase.from('visits').select('*'),
      supabase.from('payments').select('*')
    ])

    setPatients(p.data || [])
    setAppointments(a.data || [])
    setVisits(v.data || [])
    setPayments(pay.data || [])
  }

  // HASTA EKLE
  async function addPatient() {
    if (!name || !phone) return

    const { data: existing } = await supabase
      .from('patients')
      .select('id')
      .eq('name', name)
      .maybeSingle()

    if (existing) {
      alert('⚠️ Bu isimde hasta zaten var!')
      return
    }

    const { error } = await supabase.from('patients').insert([
      { name, phone }
    ])

    if (error) {
      alert(error.message)
      return
    }

    setName('')
    setPhone('')
    loadAll()
  }

  // STATS
  const today = new Date().toDateString()

  const todayAppointments = appointments.filter(a =>
    new Date(a.date).toDateString() === today
  )

  const todayVisits = visits.filter(v =>
    new Date(v.visit_date).toDateString() === today
  )

  const totalIncome = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  )

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toDateString()

  const tomorrowAppointments = appointments.filter(a =>
    new Date(a.date).toDateString() === tomorrowStr
  )

  // SAAS CHECK
  if (profile && profile.subscription_status !== 'active') {
    return <h2>🚫 Aboneliğiniz aktif değil</h2>
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>📊 Klinik Dashboard</h1>

      {/* HASTA EKLE */}
      <div style={card}>
        <h3>👤 Hasta Ekle</h3>

        <input
          placeholder="Hasta adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
        />

        <button onClick={addPatient} style={button}>
          ➕ Hasta Ekle
        </button>
      </div>

      {/* STATS */}
      <div style={grid}>
        <div style={card}>👤 Hastalar <h2>{patients.length}</h2></div>
        <div style={card}>📅 Bugün Randevu <h2>{todayAppointments.length}</h2></div>
        <div style={card}>🧾 Bugün Muayene <h2>{todayVisits.length}</h2></div>
        <div style={card}>💰 Gelir <h2>{totalIncome} ₺</h2></div>
      </div>

      {/* YARIN */}
      <div style={card}>
        <h3>🔔 Yarın Randevular</h3>

        {tomorrowAppointments.length === 0 ? (
          <p>Randevu yok</p>
        ) : (
          tomorrowAppointments.map(a => (
            <div key={a.id}>
              📅 {new Date(a.date).toLocaleString()} - {a.note}
            </div>
          ))
        )}
      </div>

    </div>
  )
}

/* STYLES */
const card = {
  background: '#fff',
  padding: 15,
  borderRadius: 10,
  border: '1px solid #ddd',
  marginTop: 10
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4,1fr)',
  gap: 10,
  marginTop: 20
}

const input = {
  display: 'block',
  marginBottom: 10,
  padding: 8,
  width: '100%'
}

const button = {
  padding: 10,
  background: 'green',
  color: 'white',
  border: 'none',
  width: '100%'
}