import { useState } from 'react'

export default function SquashModal({ commits, onClose, onSuccess }) {
  // Default message is a combination of all commit messages
  const defaultMessage = commits.map(c => c.message.trim()).join('\n\n')
  const [message, setMessage] = useState(defaultMessage)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // commits are sorted oldest-first (highest index = oldest)
  const oldestSha = commits[commits.length - 1].hash
  const newestSha = commits[0].hash

  async function handleConfirm() {
    if (!message.trim()) return
    setLoading(true)
    setError('')
    const shas = commits.map(c => c.hash)
    const result = await window.git.squashCommits(shas, message.trim())
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
          <span className="modal-title">Squash {commits.length} commits</span>
          <span className="modal-sha">{oldestSha.slice(0, 7)}…{newestSha.slice(0, 7)}</span>
        </div>
        <div className="modal-body">
          <p className="modal-description" style={{marginBottom: 14}}>
            These <strong>{commits.length} commits</strong> will be combined into one. Write the message for the new combined commit below.
          </p>
          <div className="modal-label">New combined message</div>
          <textarea
            className="modal-textarea"
            value={message}
            onChange={e => setMessage(e.target.value)}
            autoFocus
            spellCheck={false}
            style={{minHeight: 120}}
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
            {loading ? 'Squashing…' : `Squash  ⌃↵`}
          </button>
        </div>
      </div>
    </div>
  )
}