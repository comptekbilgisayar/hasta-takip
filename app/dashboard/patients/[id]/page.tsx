'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function PatientDetail() {
  const { id } = useParams()

  const [patient, setPatient] = useState<any>(null)
  const [visits, setVisits] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const p = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    const v = await supabase
      .from('visits')
      .select('*')
      .eq('patient_id', id)

    const a = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', id)

    const pay = await supabase
      .from('payments')
      .select('*')
      .eq('patient_id', id)

    setPatient(p.data)
    setVisits(v.data || [])
    setAppointments(a.data || [])
    setPayments(pay.data || [])
  }

  if (!patient) return <p>Yükleniyor...</p>

  return (
    <div style={{ padding: 20 }}>

      <h1>👤 Hasta Kartı</h1>

      {/* PATIENT INFO */}
      <div style={card}>
        <h2>{patient.name}</h2>
        <p>📞 {patient.phone}</p>
      </div>

      {/* VISITS */}
      <h3>🧾 Muayeneler</h3>
      {visits.map((v) => (
        <div key={v.id} style={card}>
          <b>{new Date(v.visit_date).toLocaleString()}</b>
          <p>🤒 {v.complaint}</p>
          <p>🧠 {v.diagnosis}</p>
        </div>
      ))}

      {/* APPOINTMENTS */}
      <h3>📅 Randevular</h3>
      {appointments.map((a) => (
        <div key={a.id} style={card}>
          📅 {new Date(a.date).toLocaleString()}
          <p>{a.note}</p>
        </div>
      ))}

      {/* PAYMENTS */}
      <h3>💰 Ödemeler</h3>
      {payments.map((p) => (
        <div key={p.id} style={card}>
          💰 {p.amount} ₺
          <p>{p.note}</p>
        </div>
      ))}

    </div>
  )
}

const card = {
  background: '#fff',
  padding: 15,
  marginBottom: 10,
  border: '1px solid #ddd',
  borderRadius: 10
}