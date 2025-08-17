import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login({ token, setToken }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // Assumes your starter backend has /api/auth/login
      const { data } = await api.post('/api/auth/login', { email, password })
      if (data?.token) {
        setToken(data.token)
        navigate('/')
      } else {
        setError('No token returned')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <h2>Officer Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label><br/>
        <input value={email} onChange={e=>setEmail(e.target.value)} required /><br/>
        <label>Password</label><br/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        If your starter project uses a different login route, update <code>/api/auth/login</code> in <code>src/api.js</code>.
      </p>
    </div>
  )
}
