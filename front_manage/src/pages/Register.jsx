import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/auth'

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    college_id: '', phone_number: '', password: '', password2: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Registration failed'))
    }
  }

  return (
    <div className="auth-card">
      <h2 className="h3 mb-3 fw-bold">Create Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <input name="first_name" className="form-control" placeholder="First name" onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <input name="last_name" className="form-control" placeholder="Last name" onChange={handleChange} />
          </div>
          <div className="col-12">
            <input name="username" className="form-control" placeholder="Username" onChange={handleChange} required />
          </div>
          <div className="col-12">
            <input name="email" type="email" className="form-control" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="col-12">
            <input name="college_id" className="form-control" placeholder="College ID / Roll No." onChange={handleChange} />
          </div>
          <div className="col-12">
            <input name="phone_number" className="form-control" placeholder="Phone number" onChange={handleChange} />
          </div>
          <div className="col-12">
            <input name="password" type="password" className="form-control" placeholder="Password" onChange={handleChange} required />
          </div>
          <div className="col-12">
            <input name="password2" type="password" className="form-control" placeholder="Confirm password" onChange={handleChange} required />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100 py-2">Register</button>
          </div>
        </div>
        <p className="mt-3 text-center text-muted">
          Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Login</Link>
        </p>
      </form>
    </div>
  )
}