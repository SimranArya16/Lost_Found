import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConversations } from '../api/messages'
import { useAuth } from '../context/AuthContext'

export default function Inbox() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    getConversations().then((res) => {
      setConversations(res.data.results || res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-state">Loading conversations...</div>

  return (
    <div className="inbox-page">
      <div className="page-header">
        <h2>Messages</h2>
        <p>Conversations about lost and found items</p>
      </div>

      {conversations.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">💬</span>
          <p>No conversations yet. Message a reporter from an item's page to start one.</p>
        </div>
      )}

      <div className="conversation-list">
        {conversations.map((c) => {
          const otherUser = c.initiator === user.id ? c.item_owner_username : c.initiator_username
          return (
            <Link to={`/messages/${c.id}`} key={c.id} className="conversation-row">
              <div className="conversation-avatar">{otherUser?.[0]?.toUpperCase() || '?'}</div>
              <div className="conversation-info">
                <div className="conversation-top">
                  <span className="conversation-name">{otherUser}</span>
                  {c.unread_count > 0 && <span className="unread-badge">{c.unread_count}</span>}
                </div>
                <span className="conversation-item">Re: {c.item_title}</span>
                {c.last_message && (
                  <span className="conversation-preview">
                    {c.last_message.sender_username === user.username ? 'You: ' : ''}
                    {c.last_message.body}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}