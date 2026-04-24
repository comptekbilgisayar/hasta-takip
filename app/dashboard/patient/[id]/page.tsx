'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function PatientPage() {
  const { id } = useParams()

  const [patient, setPatient] = useState<any>(null)
  const [visits, setVisits] = useState<any[]>([])

  useEffect(() => {
    loadPatient()
    loadVisits()
  }, [])

  async function loadPatient() {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    setPatient(data)
  }

  async function loadVisits() {
    const { data } = await supabase
      .from('visits')
      .select('*')
      .eq('patient_id', id)
      .order('visit_date', { ascending: false })

    setVisits(data || [])
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>👤 Hasta Dosyası</h1>

      {patient && (
        <div style={{ background: '#fff', padding: 15 }}>
          <h2>{patient.name}</h2>
          <p>📞 {patient.phone}</p>
        </div>
      )}

      <h3>🩺 Muayeneler</h3>

      {visits.map((v) => (
        <div key={v.id} style={{ background: '#fff', padding: 10, marginTop: 10 }}>
          📅 {new Date(v.visit_date).toLocaleString()}
          <p>Şikayet: {v.complaint}</p>
          <p>Tanı: {v.diagnosis}</p>
        </div>
      ))}

    </div>
  )
}