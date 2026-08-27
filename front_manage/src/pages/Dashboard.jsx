import React, { useEffect, useState } from 'react'
import { getItems, verifyItem } from '../api/items'
import './Dashboard.css'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const loadItems = async () => {
    setLoading(true)
    try {
      const { data } = await getItems({})
      setItems(data.results || data)
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleVerify = async (id, status) => {
    try {
      await verifyItem(id, { status, is_verified: true })
      loadItems()
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  // Helper to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">Active</span>
      case 'returned':
        return <span className="status-badge status-returned">Returned</span>
      case 'archived':
        return <span className="status-badge status-archived">Archived</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  // Helper to render action buttons
  const renderActions = (item) => {
    if (item.status === 'returned') {
      return <span className="text-success fw-semibold"><i className="fas fa-check-circle me-1"></i>Returned</span>
    }
    if (item.status === 'archived') {
      return <span className="text-muted fw-semibold"><i className="fas fa-archive me-1"></i>Archived</span>
    }
    // Active state – show both buttons
    return (
      <>
        <button
          onClick={() => handleVerify(item.id, 'returned')}
          className="btn btn-action btn-returned me-1"
        >
          <i className="fas fa-check me-1"></i>Mark Returned
        </button>
        <button
          onClick={() => handleVerify(item.id, 'archived')}
          className="btn btn-action btn-archived"
        >
          <i className="fas fa-archive me-1"></i>Archive
        </button>
      </>
    )
  }

  return (
    <div className="container py-4">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>
            <i className="fas fa-chart-line"></i>
            Admin Dashboard
          </h2>
          <span className="item-count">Total Items: {items.length}</span>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Verified</th>
                  <th>Reported By</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6" className="text-center text-muted py-4">
                      <i className="fas fa-inbox fa-2x d-block mb-2"></i>
                      No items reported yet
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.title}</td>
                      <td>
                        <span className={`badge ${item.item_type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                          {item.item_type.toUpperCase()}
                        </span>
                      </td>
                      <td>{renderStatusBadge(item.status)}</td>
                      <td>
                        {item.is_verified ? (
                          <i className="fas fa-check-circle text-success fs-5"></i>
                        ) : (
                          <i className="fas fa-times-circle text-danger fs-5"></i>
                        )}
                      </td>
                      <td>{item.reported_by_username}</td>
                      <td className="text-center">
                        {renderActions(item)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}