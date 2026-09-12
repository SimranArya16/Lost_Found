import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMessages, sendMessage } from '../api/messages'
import { useAuth } from '../context/AuthContext'

export default function Chat() {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const bottomRef = useRef(null)

  const loadMessages = async () => {
    const { data } = await getMessages(id)
    setMessages(data)
    setLoading(false)
  }

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 4000) // simple polling for near-real-time updates
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    await sendMessage(id, body)
    setBody('')
    loadMessages()
  }

  if (loading) return <div className="loading-state">Loading chat...</div>

  return (
    <div className="chat-page">
      <Link to="/messages" className="back-link">← Back to Messages</Link>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`chat-bubble ${m.sender_username === user.username ? 'chat-bubble-mine' : 'chat-bubble-theirs'}`}
            >
              <span className="chat-body">{m.body}</span>
              <span className="chat-time">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            placeholder="Type a message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}