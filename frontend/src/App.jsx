import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Violations from './pages/Violations'
import Challans from './pages/Challans'
import Alerts from './pages/Alerts'
import Login from './pages/Login'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', gap: 12, padding: 12, background: '#f5f5f5' }}>
        <Link to="/">Violations</Link>
        <Link to="/challans">Challans</Link>
        <Link to="/alerts">Alerts</Link>
        <span style={{ marginLeft: 'auto' }}>
          {token
            ? <button onClick={() => { setToken(''); navigate('/login') }}>Logout</button>
            : <Link to="/login">Login</Link>
          }
        </span>
      </nav>
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Violations token={token} />} />
          <Route path="/challans" element={<Challans token={token} />} />
          <Route path="/alerts" element={<Alerts token={token} />} />
          <Route path="/login" element={<Login token={token} setToken={setToken} />} />
        </Routes>
      </div>
    </div>
  )
}
