import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createItem } from '../api/items'

const CATEGORIES = ['id_card', 'wallet', 'electronics', 'books', 'keys', 'bag', 'other']

export default function PostItem() {
  const [form, setForm] = useState({
    title: '', description: '', category: 'other', item_type: 'lost',
    location: '', date_occurred: '',
  })
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    if (image) formData.append('image', image)

    try {
      const { data } = await createItem(formData)
      navigate(`/items/${data.id}`)
    } catch (err) {
      setError('Failed to submit item. Please check the form.')
    }
  }

  return (
    <div className="auth-card" style={{ maxWidth: '640px' }}>
      <h2 className="h3 mb-3 fw-bold">Report a Lost or Found Item</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Type</label>
          <select name="item_type" className="form-select" value={form.item_type} onChange={handleChange}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        <div className="mb-3">
          <input name="title" className="form-control" placeholder="Item title (e.g. Black wallet)" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <textarea name="description" className="form-control" rows="3" placeholder="Description" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Category</label>
          <select name="category" className="form-select" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <input name="location" className="form-control" placeholder="Location (e.g. Library, Block C)" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Date</label>
          <input type="date" name="date_occurred" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Photo (optional)</label>
          <input type="file" accept="image/*" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-primary w-100 py-2">Submit Report</button>
      </form>
    </div>
  )
}