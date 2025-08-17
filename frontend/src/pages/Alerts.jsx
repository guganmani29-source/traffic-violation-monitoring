import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Alerts() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ recipient: '', message: '', severity: 'info' })
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/alerts')
      setItems(data.items || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load alerts')
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/alerts', form)
      setForm({ recipient: '', message: '', severity: 'info' })
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Create failed')
    }
  }

  const markRead = async (id) => {
    try {
      await api.patch(`/api/alerts/${id}/read`)
      load()
    } catch (err) {
      alert(err?.response?.data?.message || 'Mark read failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this alert?')) return
    try {
      await api.delete(`/api/alerts/${id}`)
      load()
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <h2>Alerts</h2>
      <form onSubmit={create} style={{ marginBottom: 16 }}>
        <input placeholder="Recipient (+61...)" value={form.recipient} onChange={e=>setForm({...form, recipient:e.target.value})} required />
        <input placeholder="Message" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} required />
        <select value={form.severity} onChange={e=>setForm({...form, severity:e.target.value})}>
          <option value="info">info</option>
          <option value="warning">warning</option>
        </select>
        <button type="submit">Create</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Recipient</th><th>Message</th><th>Queued</th><th>Sent</th><th>Read</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(a => (
            <tr key={a._id}>
              <td>{a.recipient}</td>
              <td>{a.message}</td>
              <td>{new Date(a.queuedAt).toLocaleString()}</td>
              <td>{a.sentAt ? new Date(a.sentAt).toLocaleString() : '—'}</td>
              <td>{a.read ? 'Yes' : 'No'}</td>
              <td>
                {!a.read && <button onClick={() => markRead(a._id)}>Mark Read</button>}{' '}
                <button onClick={() => remove(a._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
