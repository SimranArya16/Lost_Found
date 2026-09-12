import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top custom-navbar">
      <div className="container-fluid px-0">
        <div className="d-flex align-items-center me-auto left-group">
          <Link to="/" className="navbar-brand fw-bold">
            <i className="fas fa-search me-2 text-primary"></i>
            Lost &amp; Found
            <span className="badge ms-2 brand-badge">College</span>
          </Link>

          {user && (
            <span className="navbar-text user-greeting ms-3">
              <i className="fas fa-user-circle me-1"></i>Hi, {user.username}
            </span>
          )}
        </div>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link custom-nav-link">Browse</NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink to="/post-item" className="nav-link custom-nav-link">Report Item</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/messages" className="nav-link custom-nav-link">Messages</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/my-reports" className="nav-link custom-nav-link">My Reports</NavLink>
                </li>
              </>
            )}

            {user?.is_staff && (
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link custom-nav-link">Admin Dashboard</NavLink>
              </li>
            )}

            {!user && (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link custom-nav-link">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link custom-nav-link">Register</NavLink>
                </li>
              </>
            )}

            {user && (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-custom btn-sm px-4 ms-2">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}