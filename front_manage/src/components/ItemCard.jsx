import React from 'react'
import { Link } from 'react-router-dom'

export default function ItemCard({ item }) {
  return (
    <div className="card h-100">
      {item.image && <img src={item.image} className="card-img-top" alt={item.title} />}
      <div className="card-body d-flex flex-column">
        <span className={`badge badge-${item.item_type} align-self-start mb-2`}>
          {item.item_type.toUpperCase()}
        </span>
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text text-muted small">{item.category.replace('_', ' ')}</p>
        <p className="card-text"><i className="fas fa-map-pin me-1"></i>{item.location}</p>
        <p className="card-text">Status: <span className="fw-semibold">{item.status}</span></p>
        <Link to={`/items/${item.id}`} className="btn btn-outline-primary btn-sm mt-auto">View Details</Link>
      </div>
    </div>
  )
}