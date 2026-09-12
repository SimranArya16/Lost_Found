import api from './axios'

export const getConversations = () => api.get('/chats/conversations/')

export const startConversation = (itemId) => api.post('/chats/conversations/', { item: itemId })

export const getMessages = (conversationId) => api.get(`/chats/conversations/${conversationId}/messages/`)

export const sendMessage = (conversationId, body) =>
  api.post(`/chats/conversations/${conversationId}/messages/`, { body })