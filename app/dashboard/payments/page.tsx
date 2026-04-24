'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])

  const [patientId, setPatientId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    loadPayments()
    loadPatients()
  }, [])

  async function loadPayments() {
    const { data } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    setPayments(data || [])
  }

  async function loadPatients() {
    const { data } = await supabase.from('patients').select('*')
    setPatients(data || [])
  }

  async function addPayment() {
    await supabase.from('payments').insert([
      {
        patient_id: patientId,
        amount: Number(amount),
        note
      }
    ])

    setPatientId('')
    setAmount('')
    setNote('')
    loadPayments()
  }

  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div>
      <h1>💰 Kasa</h1>

      <h2>Toplam Gelir: {total} ₺</h2>

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
          placeholder="Tutar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: '100%' }}
        />

        <input
          placeholder="Not"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: '100%' }}
        />

        <button onClick={addPayment} style={{ padding: 10 }}>
          Ödeme Ekle
        </button>
      </div>

      {/* LIST */}
      {payments.map((p) => (
        <div
          key={p.id}
          style={{ padding: 10, border: '1px solid #ddd', marginBottom: 10 }}
        >
          💰 {p.amount} ₺
          <div>📝 {p.note}</div>
        </div>
      ))}
    </div>
  )
}