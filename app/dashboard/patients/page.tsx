'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadPatients()
  }, [])

  async function loadPatients() {
    const { data } = await supabase.from('patients').select('*')
    setPatients(data || [])
  }

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>👤 Hastalar</h1>

      <input
        placeholder="Hasta ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 20,
          width: '100%',
          border: '1px solid #ccc'
        }}
      />

      {filtered.map((p) => (
        <Link key={p.id} href={`/dashboard/patients/${p.id}`}>
          <div style={{
            padding: 10,
            border: '1px solid #ddd',
            marginBottom: 10,
            cursor: 'pointer'
          }}>
            <b>{p.name}</b>
            <div>{p.phone}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}