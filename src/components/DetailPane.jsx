export default function DetailPane({ commit, selectedIndex, checkedCount, checkedCommits, onAction, onClearChecked }) {
  const isHead = selectedIndex === 0

  // When 2+ commits are checked, show the squash panel instead of normal detail
  if (checkedCount >= 2) {
    return (
      <div className="detail-pane">
        <div className="pane-header">
          <span className="pane-title">Squash</span>
          <button
            className="pane-clear-btn"
            onClick={onClearChecked}
          >
            Clear
          </button>
        </div>

        <div className="detail-content">
          <div className="detail-field">
            <div className="detail-label">{checkedCount} commits selected</div>
            <div className="squash-commit-list">
              {checkedCommits.map(c => (
                <div key={c.hash} className="squash-commit-item">
                  <span className="commit-sha">{c.hash.slice(0, 7)}</span>
                  <span className="squash-commit-msg">{c.message.split('\n')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-field">
            <div className="detail-label">These will be combined into one commit</div>
            <div className="detail-value" style={{color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6}}>
              You'll be able to write a new message for the combined commit. The oldest selected commit will be kept as the base — newer ones will be squashed into it.
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button
            className="action-btn action-btn-accent"
            onClick={() => onAction('squash')}
          >
            🗜️ Squash {checkedCount} commits
          </button>
          <button className="action-btn" onClick={onClearChecked}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (!commit) {
    return (
      <div className="detail-pane">
        <div className="pane-header">
          <span className="pane-title">Detail</span>
        </div>
        <div className="detail-empty">
          <div className="detail-empty-icon">←</div>
          <div>Select a commit to inspect</div>
          <div style={{fontSize: 11, marginTop: 4}}>or check multiple to squash</div>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-pane">
      <div className="pane-header">
        <span className="pane-title">Commit Detail</span>
      </div>

      <div className="detail-content">
        <div className="detail-sha-full">{commit.hash}</div>

        <div className="detail-field">
          <div className="detail-label">Message</div>
          <div className="detail-message">{commit.message.trim()}</div>
        </div>

        <div className="detail-field">
          <div className="detail-label">Author</div>
          <div className="detail-value">{commit.author_name}</div>
          <div className="detail-value" style={{color: 'var(--text-muted)', fontSize: 11}}>{commit.author_email}</div>
        </div>

        <div className="detail-field">
          <div className="detail-label">Date</div>
          <div className="detail-value">{new Date(commit.date).toLocaleString()}</div>
        </div>
      </div>

      <div className="detail-actions">
        <div className="action-label">Actions</div>

        <button
          className="action-btn"
          disabled={!isHead}
          title={!isHead ? 'Only available for the most recent commit' : ''}
          onClick={() => onAction('amend')}
        >
          ✏️ Amend message
        </button>

        <button
          className="action-btn"
          onClick={() => onAction('reword')}
        >
          💬 Reword commit
        </button>

        <button
          className="action-btn"
          disabled={!isHead}
          title={!isHead ? 'Only available for the most recent commit' : ''}
          onClick={() => onAction('undo')}
        >
          ↩️ Undo commit (keep changes)
        </button>

        <div className="action-hint">
          ☑️ Check multiple commits to squash
        </div>
      </div>
    </div>
  )
}