'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])

  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    loadAppointments()
    loadPatients()
  }, [])

  async function loadAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })

    setAppointments(data || [])
  }

  async function loadPatients() {
    const { data } = await supabase.from('patients').select('*')
    setPatients(data || [])
  }

  async function addAppointment() {
    await supabase.from('appointments').insert([
      {
        patient_id: patientId,
        date,
        note,
        status: 'pending'
      }
    ])

    setPatientId('')
    setDate('')
    setNote('')
    loadAppointments()
  }

  return (
    <div>
      <h1>📅 Randevular</h1>

      {/* FORM */}
      <div style={{ padding: 10, border: '1px solid #ddd', marginBottom: 20 }}>
        
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: '100%' }}
        >
          <option value="">Hasta seç</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: '100%' }}
        />

        <input
          placeholder="Not"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: '100%' }}
        />

        <button onClick={addAppointment} style={{ padding: 10 }}>
          Randevu Ekle
        </button>
      </div>

      {/* LIST */}
      {appointments.map((a) => (
        <div
          key={a.id}
          style={{ padding: 10, border: '1px solid #ddd', marginBottom: 10 }}
        >
          📅 {new Date(a.date).toLocaleString()}
          <div>📝 {a.note}</div>
          <div>📌 {a.status}</div>
        </div>
      ))}
    </div>
  )
}