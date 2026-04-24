'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function PatientDetail() {
  const { id } = useParams()
  const [patient, setPatient] = useState<any>(null)

  useEffect(() => {
    loadPatient()
  }, [])

  async function loadPatient() {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    setPatient(data)
  }

  if (!patient) return <p>Yükleniyor...</p>

  return (
    <div>
      <h1>👤 Hasta Kartı</h1>

      <div style={{ padding: 20, border: '1px solid #ddd' }}>
        <h2>{patient.name}</h2>
        <p>📞 {patient.phone}</p>
        <p>🆔 ID: {patient.id}</p>
      </div>
    </div>
  )
}