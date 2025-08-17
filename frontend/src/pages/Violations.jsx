import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Violations({ token }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ plate: '', type: 'signal', location: '', evidenceUrl: '' })
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/violations')
      setItems(data.items || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load violations')
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/violations', form)
      setForm({ plate: '', type: 'signal', location: '', evidenceUrl: '' })
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Create failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this violation?')) return
    try {
      await api.delete(`/api/violations/${id}`)
      load()
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <h2>Violations</h2>
      <form onSubmit={create} style={{ marginBottom: 16 }}>
        <input placeholder="Plate" value={form.plate} onChange={e=>setForm({...form, plate:e.target.value})} required />
        <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
          <option value="speed">speed</option>
          <option value="signal">signal</option>
          <option value="helmet">helmet</option>
          <option value="parking">parking</option>
        </select>
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} required />
        <input placeholder="Evidence URL" value={form.evidenceUrl} onChange={e=>setForm({...form, evidenceUrl:e.target.value})} />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Plate</th><th>Type</th><th>Location</th><th>Status</th><th>Detected</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(v => (
            <tr key={v._id}>
              <td>{v.plate}</td>
              <td>{v.type}</td>
              <td>{v.location}</td>
              <td>{v.status}</td>
              <td>{new Date(v.detectedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => remove(v._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
