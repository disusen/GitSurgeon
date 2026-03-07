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
    grid-template-columns: 20px 60px 1fr auto;
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

  /* ── Modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(2px);
  }

  .modal {
    background: var(--bg-1);
    border: 1px solid var(--border-bright);
    border-radius: 8px;
    width: 520px;
    max-width: 90vw;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }

  .modal-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .modal-sha {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--sha-text);
    background: var(--sha-bg);
    padding: 2px 6px;
    border-radius: 3px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .modal-textarea {
    width: 100%;
    min-height: 100px;
    background: var(--bg-0);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 10px 12px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-primary);
    resize: vertical;
    outline: none;
    line-height: 1.6;
    transition: border-color 0.15s;
    user-select: text;
  }

  .modal-textarea:focus {
    border-color: var(--accent);
  }

  .modal-description {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .modal-description strong {
    color: var(--text-secondary);
    font-weight: 500;
  }

  .modal-error {
    margin-top: 10px;
    padding: 8px 12px;
    background: rgba(224, 92, 92, 0.1);
    border: 1px solid rgba(224, 92, 92, 0.3);
    border-radius: 4px;
    color: var(--red);
    font-size: 12px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 20px;
    border-top: 1px solid var(--border);
  }

  .commit-checkbox {
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-bright);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.1s;
    color: #0d0d0d;
  }

  .commit-checkbox:hover { border-color: var(--accent); }

  .commit-checkbox-checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .commit-item.checked { background: var(--accent-glow); }

  .squash-commit-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
  }

  .squash-commit-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .squash-commit-msg {
    font-size: 12px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pane-clear-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
    transition: color 0.1s;
  }

  .pane-clear-btn:hover { color: var(--text-primary); }

  .action-btn-accent {
    border-color: var(--accent) !important;
    color: var(--accent) !important;
  }

  .action-btn-accent:hover { background: var(--accent-dim) !important; }

  .action-hint {
    font-size: 11px;
    color: var(--text-muted);
    padding: 4px 2px;
  }

  .btn-danger {
    background: #7f1d1d;
    color: #fca5a5;
    border-color: #991b1b;
  }
  .btn-danger:hover:not(:disabled) {
    background: #991b1b;
    border-color: #b91c1c;
  }
`

export default styles
