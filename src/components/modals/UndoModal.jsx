import { useState } from 'react'

export default function UndoModal({ commit, onClose, onSuccess }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    setError('')
    const result = await window.git.undoCommit()
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    onSuccess()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" onKeyDown={handleKeyDown}>
        <div className="modal-header">
          <span className="modal-title">Undo commit</span>
          <span className="modal-sha">{commit.hash.slice(0, 7)}</span>
        </div>
        <div className="modal-body">
          <p className="modal-description">
            This will undo <strong>{commit.message.split('\n')[0]}</strong> and put all its changes back as staged. Your work is safe — nothing will be lost.
          </p>
          {error && <div className="modal-error">{error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Undoing…' : 'Undo commit'}
          </button>
        </div>
      </div>
    </div>
  )
}