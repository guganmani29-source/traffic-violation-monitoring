import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Challans() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ violationId: '', fine: 250, dueDate: '' })
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/challans')
      setItems(data.items || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load challans')
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/challans', form)
      setForm({ violationId: '', fine: 250, dueDate: '' })
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Create failed')
    }
  }

  const markPaid = async (id) => {
    try {
      await api.patch(`/api/challans/${id}/paid`)
      load()
    } catch (err) {
      alert(err?.response?.data?.message || 'Mark paid failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this challan?')) return
    try {
      await api.delete(`/api/challans/${id}`)
      load()
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <h2>Challans</h2>
      <form onSubmit={create} style={{ marginBottom: 16 }}>
        <input placeholder="Violation ID" value={form.violationId} onChange={e=>setForm({...form, violationId:e.target.value})} required />
        <input type="number" placeholder="Fine (AUD)" value={form.fine} onChange={e=>setForm({...form, fine:e.target.value})} required />
        <input type="datetime-local" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} required />
        <button type="submit">Create</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Violation</th><th>Fine</th><th>Due</th><th>Paid</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(c => (
            <tr key={c._id}>
              <td>{c.violation?._id || '—'}</td>
              <td>{c.fine}</td>
              <td>{new Date(c.dueDate).toLocaleString()}</td>
              <td>{c.paid ? 'Yes' : 'No'}</td>
              <td>
                {!c.paid && <button onClick={() => markPaid(c._id)}>Mark Paid</button>}{' '}
                <button onClick={() => remove(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
