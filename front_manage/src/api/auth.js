import api from './axios'

export const registerUser = (payload) => api.post('/accounts/register/', payload)

export const loginUser = (payload) => api.post('/accounts/login/', payload)

export const getMe = () => api.get('/accounts/me/')