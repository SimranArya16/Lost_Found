import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostItem from './pages/PostItem'
import ItemDetail from './pages/ItemDetail'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import Chat from './pages/Chat'
import MyReports from './pages/MyReports'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/post-item" element={
            <ProtectedRoute><PostItem /></ProtectedRoute>
          } />
          <Route path="/my-reports" element={
            <ProtectedRoute><MyReports /></ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute><Inbox /></ProtectedRoute>
          } />
          <Route path="/messages/:id" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  )
}