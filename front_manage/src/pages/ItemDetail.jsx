import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItem, deleteItem } from '../api/items'
import { startConversation } from '../api/messages'
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

  const handleMessage = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    const { data } = await startConversation(item.id)
    navigate(`/messages/${data.id}`)
  }

  if (!item) return <div className="loading-state">Loading...</div>

  const canManage = user && (user.is_staff || user.id === item.reported_by)
  const isOwner = user && user.id === item.reported_by

  return (
    <div className="item-detail-page">
      <div className="item-detail-image">
        {item.image ? <img src={item.image} alt={item.title} /> : <div className="detail-placeholder">📦</div>}
        <span className={`badge badge-${item.item_type}`}>{item.item_type.toUpperCase()}</span>
      </div>

      <div className="item-detail-info">
        <span className={`status-pill status-${item.status}`}>{item.status}</span>
        <h2>{item.title}</h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">Category</span>
            <span className="detail-value">{item.category.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="detail-label">Location</span>
            <span className="detail-value"> {item.location}</span>
          </div>
          <div>
            <span className="detail-label">Date</span>
            <span className="detail-value">{item.date_occurred}</span>
          </div>
          <div>
            <span className="detail-label">Reported by</span>
            <span className="detail-value">{item.reported_by_username}</span>
          </div>
        </div>

        <div className="detail-description">
          <span className="detail-label">Description</span>
          <p>{item.description}</p>
        </div>

        <div className="actions">
          {!isOwner && (
            <button className="message-btn" onClick={handleMessage}>💬 Message Reporter</button>
          )}
          {canManage && (
            <button onClick={handleDelete}>🗑 Delete Report</button>
          )}
        </div>
      </div>
    </div>
  )
}