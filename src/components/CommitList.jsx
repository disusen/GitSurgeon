import { formatDate } from '../utils/formatDate'

export default function CommitList({ commits, selected, onSelect, checkedSet, onToggleCheck, error }) {
  return (
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
            <span className="commit-count">
              {checkedSet.size > 0 ? `${checkedSet.size} selected` : `${commits.length} loaded`}
            </span>
          </div>
          <div className="commit-list">
            {commits.map((c, i) => {
              const isChecked = checkedSet.has(i)
              const isSelected = selected === i
              return (
                <div
                  key={c.hash}
                  className={`commit-item${isSelected ? ' selected' : ''}${isChecked ? ' checked' : ''}`}
                  onClick={() => onSelect(i)}
                >
                  {/* Checkbox */}
                  <div
                    className={`commit-checkbox${isChecked ? ' commit-checkbox-checked' : ''}`}
                    onClick={e => { e.stopPropagation(); onToggleCheck(i) }}
                  >
                    {isChecked && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    )}
                  </div>

                  <span className="commit-sha">{c.hash.slice(0, 7)}</span>

                  <div className="commit-body">
                    <div className="commit-message">{c.message.split('\n')[0]}</div>
                    <div className="commit-meta">{c.author_name}</div>
                  </div>

                  <span className="commit-date">{formatDate(c.date)}</span>
                </div>
              )
            })}
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
  )
}