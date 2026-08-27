import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/protectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostItem from './pages/PostItem'
import ItemDetail from './pages/ItemDetail'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/post-item" element={
          <ProtectedRoute><PostItem /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
        } />
      </Routes>
    </>
  )
}