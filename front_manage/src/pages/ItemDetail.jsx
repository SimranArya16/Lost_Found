import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItem, deleteItem } from '../api/items'
import { useAuth } from '../context/AuthContext'

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getItem(id).then((res) => setItem(res.data))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this report?')) return
    await deleteItem(id)
    navigate('/')
  }

  if (!item) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>

  const canManage = user && (user.is_staff || user.id === item.reported_by)

  return (
    <div className="container py-4" style={{ maxWidth: '760px' }}>
      <div className="card p-4 shadow-sm border-0 rounded-4">
        {item.image && <img src={item.image} className="img-fluid rounded-4 mb-3" alt={item.title} style={{ maxHeight: '360px', objectFit: 'cover' }} />}
        <h2 className="fw-bold">{item.title}</h2>
        <span className={`badge badge-${item.item_type} d-inline-block mb-3`}>{item.item_type.toUpperCase()}</span>
        <p><strong>Category:</strong> {item.category.replace('_', ' ')}</p>
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Date:</strong> {item.date_occurred}</p>
        <p><strong>Status:</strong> {item.status}</p>
        <p><strong>Reported by:</strong> {item.reported_by_username}</p>
        <p>{item.description}</p>

        {canManage && (
          <div className="mt-3">
            <button onClick={handleDelete} className="btn btn-danger">
              <i className="fas fa-trash me-2"></i>Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}