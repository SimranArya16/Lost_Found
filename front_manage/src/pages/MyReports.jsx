import React, { useEffect, useState } from 'react'
import { getMyReports } from '../api/items'
import ItemCard from '../components/ItemCard'

export default function MyReports() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyReports().then((res) => {
      setItems(res.data.results || res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-state">Loading your reports...</div>

  return (
    <div className="home">
      <div className="page-header page-header-centered">
        <h2>My Reports</h2>
        <p>Items you've reported as lost or found</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <h5>No reports yet</h5>
          <p>Items you report will show up here.</p>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}