# GitSurgeon

A focused desktop app for fixing git history — without touching vim or memorizing rebase commands.

![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=flat&logo=electron&logoColor=9FEAF9)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

---

## The problem

Fixing git history is painful. Rewording an old commit forces you into vim. Squashing requires memorizing interactive rebase syntax. Undoing a commit without losing work means remembering the right `reset` flags. There are full git clients that can do all of this, but they're heavyweight and bury these operations under layers of UI.

GitSurgeon is a small, focused tool that does one thing: lets you fix git history without touching the CLI.

---

## Operations

| Operation | What it does |
|---|---|
| **Amend** | Edit the most recent commit's message |
| **Reword** | Edit any commit's message in history |
| **Undo** | Soft-reset the most recent commit — changes go back to staged |
| **Squash** | Combine multiple commits into one with a new message |

---

## Stack

- **Electron** — desktop shell
- **React + Vite** — UI
- **simple-git** — git operations via Node.js (no CLI shelling out for core ops; rebase operations use `GIT_SEQUENCE_EDITOR` env override to avoid vim)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Git](https://git-scm.com/) installed and on your PATH
- Windows 10/11 (primary target; macOS untested but likely works)

---

## Setup

```bash
git clone https://github.com/disusen/GitSurgeon.git
cd GitSurgeon
npm install
```

---

## Running in development

You need two terminals:

**Terminal 1 — start the Vite dev server:**
```bash
npm run dev
```

**Terminal 2 — launch Electron (once Vite is ready):**
```bash
npm run electron
```

---

## Usage

1. Click **Browse** or paste a path into the repo bar and hit **Open**
2. The commit list loads automatically — click any commit to inspect it
3. Use the action buttons in the right panel:
   - **Amend** and **Undo** are only available on the most recent commit (HEAD)
   - **Reword** is available on any commit
   - **Squash** — check two or more commits using the checkboxes on the left, then click the squash button that appears in the right panel

---

## Project structure

```
GitSurgeon/
├── electron/
│   ├── main.js          # Electron main process, IPC handlers, git operations
│   └── preload.js       # Secure context bridge — exposes git/dialog APIs to renderer
└── src/
    ├── App.jsx           # Root state and layout
    ├── styles.js         # All CSS
    ├── utils/
    │   └── formatDate.js
    └── components/
        ├── Toolbar.jsx
        ├── CommitList.jsx
        ├── DetailPane.jsx
        └── modals/
            ├── AmendModal.jsx
            ├── RewordModal.jsx
            ├── UndoModal.jsx
            └── SquashModal.jsx
```

---

## Architecture notes

**IPC bridge** — Electron's `contextBridge` exposes a minimal `window.git` API to the React frontend. All git operations run in the main process, never the renderer. This keeps Node.js out of the browser context entirely.

**Rebase operations** — Reword and squash use `git rebase --interactive` under the hood, but with `GIT_SEQUENCE_EDITOR` and `GIT_EDITOR` env vars set to small Node.js scripts that write directly to the todo/message files. This lets us drive interactive rebase programmatically without vim.

**No vim, ever** — That's the point.

---

## Known limitations

- Reword and squash rewrite history — don't use on commits that have already been pushed to a shared branch
- Squash requires selecting commits that form a contiguous range in history
- No support for merge commits

---

## License

MIT