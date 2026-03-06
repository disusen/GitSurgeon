import { useState } from 'react'

export default function RewordModal({ commit, onClose, onSuccess }) {
  const [message, setMessage] = useState(commit.message.trim())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!message.trim()) return
    setLoading(true)
    setError('')
    const result = await window.git.rewordCommit(commit.hash, message.trim())
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    onSuccess()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleConfirm()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" onKeyDown={handleKeyDown}>
        <div className="modal-header">
          <span className="modal-title">Reword commit</span>
          <span className="modal-sha">{commit.hash.slice(0, 7)}</span>
        </div>
        <div className="modal-body">
          <div className="modal-label">New message</div>
          <textarea
            className="modal-textarea"
            value={message}
            onChange={e => setMessage(e.target.value)}
            autoFocus
            spellCheck={false}
          />
          {error && <div className="modal-error">{error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={loading || !message.trim()}
          >
            {loading ? 'Rewording…' : 'Reword  ⌃↵'}
          </button>
        </div>
      </div>
    </div>
  )
}