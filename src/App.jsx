import { useState, useEffect } from 'react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-0: #0d0d0d;
    --bg-1: #141414;
    --bg-2: #1a1a1a;
    --bg-3: #222222;
    --bg-hover: #2a2a2a;
    --border: #2e2e2e;
    --border-bright: #444444;
    --text-primary: #e8e8e8;
    --text-secondary: #888888;
    --text-muted: #555555;
    --accent: #f0a500;
    --accent-dim: rgba(240, 165, 0, 0.12);
    --accent-glow: rgba(240, 165, 0, 0.06);
    --red: #e05c5c;
    --green: #5ce08a;
    --blue: #5ca8e0;
    --sha-bg: #1e1e2e;
    --sha-text: #7c7cff;
    --font-mono: 'JetBrains Mono', monospace;
    --font-ui: 'Inter', sans-serif;
  }

  body {
    background: var(--bg-0);
    color: var(--text-primary);
    font-family: var(--font-ui);
    font-size: 13px;
    line-height: 1.5;
    overflow: hidden;
    height: 100vh;
    user-select: none;
  }

  .app {
    display: grid;
    grid-template-rows: 48px 1fr;
    height: 100vh;
  }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    background: var(--bg-1);
    border-bottom: 1px solid var(--border);
    -webkit-app-region: drag;
  }

  .toolbar-logo {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.05em;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .toolbar-logo span {
    color: var(--text-muted);
    font-weight: 300;
  }

  .repo-input-wrap {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 6px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0 10px;
    height: 30px;
    -webkit-app-region: no-drag;
    transition: border-color 0.15s;
  }

  .repo-input-wrap:focus-within {
    border-color: var(--border-bright);
  }

  .repo-input-wrap svg {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .repo-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
    min-width: 0;
  }

  .repo-input::placeholder { color: var(--text-muted); }

  .btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 12px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--bg-3);
    color: var(--text-secondary);
    font-family: var(--font-ui);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    transition: all 0.12s;
    white-space: nowrap;
  }

  .btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--border-bright);
  }

  .btn-primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #0d0d0d;
    font-weight: 600;
  }

  .btn-primary:hover {
    background: #f5b420;
    border-color: #f5b420;
    color: #0d0d0d;
  }

  .branch-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;
    height: 24px;
    background: var(--accent-dim);
    border: 1px solid rgba(240, 165, 0, 0.2);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    flex-shrink: 0;
    -webkit-app-region: no-drag;
  }

  /* ── Main layout ── */
  .main {
    display: grid;
    grid-template-columns: 1fr 320px;
    overflow: hidden;
  }

  /* ── Commit list ── */
  .commit-list-pane {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);
    overflow: hidden;
  }

  .pane-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 36px;
    background: var(--bg-1);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .pane-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .commit-count {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
  }

  .commit-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .commit-list::-webkit-scrollbar { width: 6px; }
  .commit-list::-webkit-scrollbar-track { background: transparent; }
  .commit-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .commit-list::-webkit-scrollbar-thumb:hover { background: var(--border-bright); }

  .commit-item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.08s;
  }

  .commit-item:hover { background: var(--bg-2); }

  .commit-item.selected {
    background: var(--accent-dim);
    border-bottom-color: rgba(240, 165, 0, 0.1);
  }

  .commit-item.selected .commit-sha { color: var(--accent); }

  .commit-sha {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--sha-text);
    letter-spacing: 0.02em;
  }

  .commit-body { min-width: 0; }

  .commit-message {
    font-size: 12.5px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
  }

  .commit-meta {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .commit-date {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    white-space: nowrap;
  }

  /* ── Detail pane ── */
  .detail-pane {
    display: flex;
    flex-direction: column;
    background: var(--bg-1);
    overflow: hidden;
  }

  .detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .detail-content::-webkit-scrollbar { width: 6px; }
  .detail-content::-webkit-scrollbar-track { background: transparent; }
  .detail-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .detail-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 12px;
  }

  .detail-empty-icon {
    font-size: 28px;
    opacity: 0.3;
  }

  .detail-sha-full {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    word-break: break-all;
    margin-bottom: 16px;
    padding: 8px 10px;
    background: var(--bg-2);
    border-radius: 4px;
    border: 1px solid var(--border);
  }

  .detail-field { margin-bottom: 16px; }

  .detail-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  .detail-value {
    font-size: 12.5px;
    color: var(--text-primary);
    line-height: 1.6;
  }

  .detail-message {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.7;
    padding: 10px 12px;
    background: var(--bg-2);
    border-radius: 4px;
    border: 1px solid var(--border);
  }

  .detail-actions {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }

  .action-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 2px;
  }

  .action-btn {
    width: 100%;
    padding: 8px 12px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 5px;
    color: var(--text-secondary);
    font-family: var(--font-ui);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: all 0.12s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--border-bright);
  }

  .action-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .action-btn.danger:hover {
    border-color: var(--red);
    color: var(--red);
  }

  /* ── Empty state ── */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
    padding: 40px;
    text-align: center;
  }

  .empty-state-title {
    font-size: 15px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .empty-state-sub {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  /* ── Error bar ── */
  .error-bar {
    padding: 8px 16px;
    background: rgba(224, 92, 92, 0.1);
    border-bottom: 1px solid rgba(224, 92, 92, 0.3);
    color: var(--red);
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 12px 0;
  }
`

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isHeadCommit(index) {
  return index === 0
}

export default function App() {
  const [repoPath, setRepoPath] = useState('')
  const [branch, setBranch] = useState('')
  const [commits, setCommits] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  async function handleOpenFolder() {
    const folder = await window.dialog.openFolder()
    if (!folder) return
    await loadRepo(folder)
  }

  async function handlePathSubmit(e) {
    if (e.key === 'Enter' && repoPath.trim()) {
      await loadRepo(repoPath.trim())
    }
  }

  async function loadRepo(path) {
    setError('')
    setSelected(null)
    const result = await window.git.openRepo(path)
    if (!result.success) {
      setError(result.error)
      setCommits([])
      setBranch('')
      return
    }
    setRepoPath(path)
    setBranch(result.branch)
    const log = await window.git.getCommits(100)
    if (log.success) setCommits(log.commits)
    else setError(log.error)
  }

  const selectedCommit = selected !== null ? commits[selected] : null

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* Toolbar */}
        <div className="toolbar">
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
              onKeyDown={handlePathSubmit}
              placeholder="Path to repository..."
              spellCheck={false}
            />
          </div>

          <button className="btn" onClick={handleOpenFolder}>Browse</button>
          <button className="btn btn-primary" onClick={() => repoPath && loadRepo(repoPath)}>Open</button>

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
        </div>

        {/* Main */}
        <div className="main">

          {/* Commit list */}
          <div className="commit-list-pane">
            {error && (
              <div className="error-bar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {commits.length > 0 ? (
              <>
                <div className="pane-header">
                  <span className="pane-title">Commits</span>
                  <span className="commit-count">{commits.length} loaded</span>
                </div>
                <div className="commit-list">
                  {commits.map((c, i) => (
                    <div
                      key={c.hash}
                      className={`commit-item${selected === i ? ' selected' : ''}`}
                      onClick={() => setSelected(i)}
                    >
                      <span className="commit-sha">{c.hash.slice(0, 7)}</span>
                      <div className="commit-body">
                        <div className="commit-message">{c.message.split('\n')[0]}</div>
                        <div className="commit-meta">{c.author_name}</div>
                      </div>
                      <span className="commit-date">{formatDate(c.date)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                  <circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/>
                  <line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
                </svg>
                <div className="empty-state-title">No repository open</div>
                <div className="empty-state-sub">Browse for a folder or paste a path above and hit Open</div>
              </div>
            )}
          </div>

          {/* Detail pane */}
          <div className="detail-pane">
            <div className="pane-header">
              <span className="pane-title">
                {selectedCommit ? 'Commit Detail' : 'Detail'}
              </span>
            </div>

            {selectedCommit ? (
              <>
                <div className="detail-content">
                  <div className="detail-sha-full">{selectedCommit.hash}</div>

                  <div className="detail-field">
                    <div className="detail-label">Message</div>
                    <div className="detail-message">{selectedCommit.message.trim()}</div>
                  </div>

                  <div className="detail-field">
                    <div className="detail-label">Author</div>
                    <div className="detail-value">{selectedCommit.author_name}</div>
                    <div className="detail-value" style={{color: 'var(--text-muted)', fontSize: 11}}>{selectedCommit.author_email}</div>
                  </div>

                  <div className="detail-field">
                    <div className="detail-label">Date</div>
                    <div className="detail-value">{new Date(selectedCommit.date).toLocaleString()}</div>
                  </div>
                </div>

                <div className="detail-actions">
                  <div className="action-label">Actions</div>

                  <button
                    className="action-btn"
                    disabled={!isHeadCommit(selected)}
                    title={!isHeadCommit(selected) ? 'Only available for the most recent commit' : ''}
                  >
                    ✏️ Amend message
                  </button>

                  <button className="action-btn">
                    💬 Reword commit
                  </button>

                  <button
                    className="action-btn"
                    disabled={!isHeadCommit(selected)}
                    title={!isHeadCommit(selected) ? 'Only available for the most recent commit' : ''}
                  >
                    ↩️ Undo commit (keep changes)
                  </button>

                  <button className="action-btn" disabled>
                    🗜️ Squash with next
                  </button>
                </div>
              </>
            ) : (
              <div className="detail-empty">
                <div className="detail-empty-icon">←</div>
                <div>Select a commit to inspect</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}