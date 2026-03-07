import { useState } from 'react'

export default function Toolbar({ repoPath, setRepoPath, branch, onBrowse, onOpen, isDirty, onForcePushSuccess }) {
  const [pushing, setPushing] = useState(false)
  const [pushError, setPushError] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && repoPath.trim()) onOpen(repoPath.trim())
  }

  async function handleForcePush() {
    setPushing(true)
    setPushError('')
    const result = await window.git.forcePush()
    setPushing(false)
    if (!result.success) {
      setPushError(result.error)
    } else {
      onForcePushSuccess()
    }
  }

  return (
    <div className="toolbar" style={{ flexWrap: 'wrap', gap: pushError ? 4 : undefined }}>
      <div className="toolbar-logo">git<span>/</span>surgeon</div>

      <div className="repo-input-wrap">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <input
          className="repo-input"
          value={repoPath}
          onChange={e => setRepoPath(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Path to repository..."
          spellCheck={false}
        />
      </div>

      <button className="btn" onClick={onBrowse}>Browse</button>
      <button className="btn btn-primary" onClick={() => repoPath && onOpen(repoPath)}>Open</button>

      {branch && (
        <div className="branch-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="6" y1="3" x2="6" y2="15"/>
            <circle cx="18" cy="6" r="3"/>
            <circle cx="6" cy="18" r="3"/>
            <path d="M18 9a9 9 0 0 1-9 9"/>
          </svg>
          {branch}
        </div>
      )}

      {isDirty && branch && (
        <button
          className="btn btn-danger"
          onClick={handleForcePush}
          disabled={pushing}
          title="Force push rewrites remote history. Safe only on branches you own."
        >
          {pushing ? 'Pushing…' : '⚠️ Force Push'}
        </button>
      )}

      {pushError && (
        <div className="modal-error" style={{ width: '100%', marginTop: 2, fontSize: 11 }}>
          {pushError}
        </div>
      )}
    </div>
  )
}