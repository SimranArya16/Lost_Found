import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="welcome-section">
        <h1>Lost & Found</h1>
        <h3>COLLEGE</h3>
        <p>Report and find lost items on campus.</p>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Sign in</h2>
         
          <div className="login-name">
            <i className="fas fa-user-circle"></i>
            <span>WELCOME</span>
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
           
            </div>
          </div>

          {/* === This is the missing section === */}
          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" /> <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-login">Sign In</button>

          <p className="login-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}