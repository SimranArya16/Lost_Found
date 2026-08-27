import api from './axios'

export const getItems = (params) => api.get('/items/', { params })

export const getItem = (id) => api.get(`/items/${id}/`)

export const createItem = (formData) =>
  api.post('/items/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const updateItem = (id, formData) =>
  api.patch(`/items/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const deleteItem = (id) => api.delete(`/items/${id}/`)

export const getMyReports = () => api.get('/items/my_reports/')

export const verifyItem = (id, payload) => api.post(`/items/${id}/verify/`, payload)