import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// refresh token automatically on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refresh')
        const { data } = await axios.post('http://127.0.0.1:8000/api/accounts/login/refresh/', { refresh })
        localStorage.setItem('access', data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshErr) {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api