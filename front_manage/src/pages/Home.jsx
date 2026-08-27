import React, { useEffect, useState } from 'react'
import { getItems } from '../api/items'
import ItemCard from '../components/ItemCard'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const CATEGORIES = ['id_card', 'wallet', 'electronics', 'books', 'keys', 'bag', 'other']

export default function Home() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [itemType, setItemType] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTriggered, setSearchTriggered] = useState(false)
  const { user } = useAuth()

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      if (itemType) params.item_type = itemType
      const { data } = await getItems(params)
      setItems(data.results || data)
      setSearchTriggered(true)
    } catch (error) {
      console.error('Error fetching items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-search when category or type changes
  useEffect(() => {
    fetchItems()
  }, [category, itemType])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchItems()
  }

  const handleClearSearch = () => {
    setSearch('')
    setCategory('')
    setItemType('')
    // Fetch all items after clearing
    setTimeout(() => fetchItems(), 100)
  }

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="home-title">
              <i className="fas fa-search"></i>
              Browse Lost &amp; Found Items
            </h1>
            <p className="home-subtitle">
              Search for lost items or report something you've found
            </p>
          </div>
          <div className="header-actions">
            {user ? (
              <Link to="/post-item" className="btn btn-sm btn-outline-primary header-report-btn">
                <i className="fas fa-plus me-1"></i> Report Item
              </Link>
            ) : (
              <Link to="/login" className="btn btn-sm btn-outline-primary header-report-btn">
                <i className="fas fa-sign-in-alt me-1"></i> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card">
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by title, description, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select form-select-lg" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-lg" value={itemType} onChange={(e) => setItemType(e.target.value)}>
                <option value="">All types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100 search-btn">
                <i className="fas fa-search me-2"></i>Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Result count - now properly styled */}
          {searchTriggered && (
            <div className="result-count-wrapper">
              <div className="result-count">
                <i className="fas fa-list-ul me-2"></i>
                Found <strong>{items.length}</strong> {items.length === 1 ? 'item' : 'items'}
                {(search || category || itemType) && (
                  <button onClick={handleClearSearch} className="btn-clear-filters">
                    <i className="fas fa-times"></i> Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {items.length === 0 && searchTriggered ? (
              <div className="col-12">
                <div className="empty-state">
                  <i className="fas fa-box-open"></i>
                  <h5>No items found</h5>
                  <p>Try adjusting your search or filter criteria.</p>
                  {user ? (
                    <Link to="/post-item" className="btn btn-primary mt-3">
                      <i className="fas fa-plus me-2"></i>Report an Item
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-primary mt-3">
                      <i className="fas fa-sign-in-alt me-2"></i>Login to Report
                    </Link>
                  )}
                </div>
              </div>
            ) : items.length === 0 && !searchTriggered ? (
              <div className="col-12">
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <h5>No items reported yet</h5>
                  <p>Be the first to report a lost or found item!</p>
                  {user ? (
                    <Link to="/post-item" className="btn btn-primary mt-3">
                      <i className="fas fa-plus me-2"></i>Report an Item
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-primary mt-3">
                      <i className="fas fa-sign-in-alt me-2"></i>Login to Report
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div className="col" key={item.id}>
                  <ItemCard item={item} />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}