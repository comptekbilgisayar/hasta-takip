'use client'
import jsPDF from 'jspdf'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function VisitsPage() {
  const [visits, setVisits] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])

  const [patientId, setPatientId] = useState('')
  const [complaint, setComplaint] = useState('')
  const [diagnosis, setDiagnosis] = useState('')

  useEffect(() => {
    loadVisits()
    loadPatients()
  }, [])

  async function loadVisits() {
    const { data } = await supabase
      .from('visits')
      .select('*')
      .order('visit_date', { ascending: false })

    setVisits(data || [])
  }

  async function loadPatients() {
    const { data } = await supabase.from('patients').select('*')
    setPatients(data || [])
  }

  async function addVisit() {
    await supabase.from('visits').insert([
      {
        patient_id: patientId,
        complaint,
        diagnosis,
        visit_date: new Date()
      }
    ])

    setPatientId('')
    setComplaint('')
    setDiagnosis('')
    loadVisits()
  }
function generatePDF(visit: any, patient: any) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("Klinik Muayene Raporu", 20, 20)

  doc.setFontSize(12)
  doc.text(`Hasta: ${patient?.name}`, 20, 40)
  doc.text(`Telefon: ${patient?.phone}`, 20, 50)

  doc.text(`Şikayet: ${visit.complaint}`, 20, 70)
  doc.text(`Tanı: ${visit.diagnosis}`, 20, 80)

  doc.text(`Tarih: ${new Date(visit.visit_date).toLocaleString()}`, 20, 100)

  doc.save(`muayene-${patient?.name}.pdf`)
}
  return (
    <div>
      <h1>🧾 Muayeneler</h1>

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
          placeholder="Şikayet"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: '100%' }}
        />

        <input
          placeholder="Tanı"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: '100%' }}
        />

        <button onClick={addVisit} style={{ padding: 10 }}>
          Muayene Kaydet
        </button>
      </div>

      {/* LIST */}
      {visits.map((v) => (
        <div
          key={v.id}
          style={{ padding: 10, border: '1px solid #ddd', marginBottom: 10 }}
        >
          📅 {new Date(v.visit_date).toLocaleString()}
          <div>🤒 {v.complaint}</div>
          <div>🧠 {v.diagnosis}</div>
        </div>
      ))}
      <button
  onClick={() => generatePDF(v, patients.find(p => p.id === v.patient_id))}
  style={{ marginTop: 10 }}
>
  📄 PDF Oluştur
</button>
    </div>
  )
}